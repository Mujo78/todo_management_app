using AutoMapper;
using server.Exceptions;
using server.DTO.User;
using server.Models;
using server.Repository.IRepository;
using server.Services.IService;
using BCrypt.Net;
using server.Data;
using server.Utils.Enums;
using server.DTO.Assignment;

namespace server.Services
{
    public class UserService(ApplicationDBContext db, IUserRepository repository, IAuthService authService, IMailService mailService, IMapper mapper) : IUserService
    {
        private readonly ApplicationDBContext db = db;
        private readonly IUserRepository repository = repository;
        private readonly IAuthService authService = authService;
        private readonly IMailService mailService = mailService;
        private readonly IMapper mapper = mapper;

        public async Task<MyInfoDTO> GetMyProfileInfo()
        {
            var userId = authService.GetUserId();
            var myInfo = await repository.GetUser(userId) ?? throw new NotFoundException("User not found.");

            var assignments = db.Assignments.Where(a => a.UserId.Equals(userId)).ToList();
            var total = assignments.Count;
            var completed = assignments.Count(a => a.Status == Status.Completed);
            var failed = assignments.Count(a => a.Status == Status.Failed);
            var open = assignments.Count(a => a.Status == Status.Open);

            var assignmentCount = new AssignmentCountDTO
            {
                Total = total,
                Completed = completed,
                Failed = failed,
                Open = open
            };

            return new MyInfoDTO
            {
                AssignmentCount = assignmentCount,
                User = mapper.Map<UserDTO>(myInfo)
            };
        }
        public async Task ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            var userId = authService.GetUserId();
            var user = await repository.GetUser(userId) ?? throw new NotFoundException("User not found.");

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDTO.OldPassword, user.Password))
                throw new BadRequestException("Wrong old password.");
            if (!changePasswordDTO.NewPassword.Equals(changePasswordDTO.ConfirmNewPassword))
                throw new BadRequestException("New password and confirm password must match.");
            if (BCrypt.Net.BCrypt.Verify(changePasswordDTO.NewPassword, user.Password))
                throw new BadRequestException("New password cannot be the same as the old password.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordDTO.NewPassword, 12);
            user.Password = hashedPassword;
            bool isSuccess = await repository.SaveAsync();
            if (!isSuccess) throw new Exception("Password not changed.");
        }

        public async Task Register(RegistrationDTO registrationDTO)
        {
            using var transaction = db.Database.BeginTransaction();
            bool emailTaken = repository.EmailAlreadyUsed(registrationDTO.Email);
            if (emailTaken) throw new ConflictException("Email is already used!");

            User user = new()
            {
                Name = registrationDTO.Name,
                Email = registrationDTO.Email,
                EmailConfirmed = false,
                Password = BCrypt.Net.BCrypt.HashPassword(registrationDTO.Password, 12),
                CreatedAt = DateTime.Now,
            };

            try
            {
                string verificationToken = Guid.NewGuid().ToString();
                await repository.CreateUserAsync(user, verificationToken);
                await mailService.SendVerificationMailAsync(user.Email, user.Name, verificationToken);
                
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }

        public async Task<UserDTO> UpdateUser(UserUpdateDTO updateDTO)
        {
            var userId = authService.GetUserId();
            if (!updateDTO.Id.Equals(userId)) throw new ForbidException("You are not authorize to access these resources.");

            var userFound = await repository.GetUser(userId) ?? throw new NotFoundException("User not found.");

            bool emailTaken = repository.EmailAlreadyUsed(updateDTO.Email, userId);
            if (emailTaken) throw new ConflictException("Email is already used!");

            userFound.Email = updateDTO.Email;
            userFound.Name = updateDTO.Name;

            await repository.UpdateAsync(userFound);

            return mapper.Map<UserDTO>(userFound);
        }

        public async Task ForgotPassword(string email)
        {
            var user = await repository.GetUser(email) ?? throw new NotFoundException("User not found.");

            UserToken token = new()
            {
                UserId = user.Id,
                Token = Guid.NewGuid().ToString(),
                TokenType = TokenType.PasswordReset,
                ExpiresAt = DateTime.Now.AddHours(2),
                CreatedAt = DateTime.Now,
            };

            try
            {
                await repository.CreateResetPasswordToken(token);
                await mailService.SendForgotPasswordMailAsync(user.Email, user.Name, token.Token);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task DeleteMyProfile()
        {
            var userId = authService.GetUserId();
            var user = await repository.GetUser(userId) ?? throw new NotFoundException("User not found.");

            using var transaction = db.Database.BeginTransaction();
            
            try
            {
                await repository.DeleteUser(user);
                await mailService.SendDeleteMailAsync(user.Email, user.Name);
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }

        public async Task VerifyEmail(string verificationToken)
        {
            var (user, userToken) = await ValidateUserAndUserToken(verificationToken);
            using var transaction = db.Database.BeginTransaction();

            try
            {
                await repository.VerifyEmailAddress(user, userToken);
                await mailService.SendWelcomeMailAsync(user.Email, user.Name);
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }

        public async Task ResetPassword(string token, ResetPasswordDTO resetPasswordDTO)
        {
            if (!resetPasswordDTO.NewPassword.Equals(resetPasswordDTO.ConfirmNewPassword))
                throw new BadRequestException("New password and confirm password must match.");

            var (user, userToken) = await ValidateUserAndUserToken(token);

            if (BCrypt.Net.BCrypt.Verify(resetPasswordDTO.NewPassword, user.Password))
                throw new BadRequestException("New password cannot be the same as the old password.");

            using var transaction = db.Database.BeginTransaction();

            try
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDTO.NewPassword, 12);
                await repository.ResetPassword(user, userToken);
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }

        public async Task<(User user, UserToken userToken)> ValidateUserAndUserToken(string token)
        {
            var userToken = await repository.GetUserToken(token) ?? throw new NotFoundException("Invalid token provided. Token not found.");

            bool isValid = repository.IsUserTokenValid(userToken);
            if (!isValid) throw new BadRequestException("Invalid token provided.");

            var user = await repository.GetUser(userToken.UserId) ?? throw new NotFoundException("User not found.");

            return (user, userToken);
        }
    }
}
