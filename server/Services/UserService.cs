﻿using AutoMapper;
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
            var myInfo = await repository.GetUser(userId) ?? throw new NotFoundException("myInfoService.userNotFound");

            var assignments = db.Assignments.Where(a => a.UserId.Equals(userId)).ToList();
            var total = assignments.Count;
            var completed = assignments.Count(a => a.Status == Status.Completed);
            var failed = assignments.Count(a => a.Status == Status.Failed);
            var open = assignments.Count(a => a.Status == Status.Open);

            var average = (completed + failed + open) / 4;

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
                User = mapper.Map<UserDTO>(myInfo),
                Average = average
            };
        }
        public async Task ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            var userId = authService.GetUserId();
            var user = await repository.GetUser(userId) ?? throw new NotFoundException("changePasswordService.userNotFound");

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDTO.OldPassword, user.Password))
                throw new BadRequestException("changePasswordService.wrongOldPassword");
            if (!changePasswordDTO.NewPassword.Equals(changePasswordDTO.ConfirmNewPassword))
                throw new BadRequestException("changePasswordService.passwordsMustMatch");
            if (BCrypt.Net.BCrypt.Verify(changePasswordDTO.NewPassword, user.Password))
                throw new BadRequestException("changePasswordService.newPasswordSameAsOld");

            try
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordDTO.NewPassword, 12);
                user.Password = hashedPassword;
                await repository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task Register(RegistrationDTO registrationDTO)
        {
            if (!registrationDTO.Password.Equals(registrationDTO.ConfirmPassword)) throw new BadRequestException("registrationService.passwordsMustMatch");

            using var transaction = db.Database.BeginTransaction();
            bool emailTaken = repository.EmailAlreadyUsed(registrationDTO.Email);
            if (emailTaken) throw new ConflictException("registrationService.emailAlreadyUsed");

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
            if (!updateDTO.Id.Equals(userId)) throw new ForbidException("editProfileService.notAuthorized");

            var userFound = await repository.GetUser(userId) ?? throw new NotFoundException("editProfileService.userNotFound");

            bool emailTaken = repository.EmailAlreadyUsed(updateDTO.Email, userId);
            if (emailTaken) throw new ConflictException("editProfileService.emailAlreadyUsed");

            userFound.Email = updateDTO.Email;
            userFound.Name = updateDTO.Name;

            try
            {
                await repository.UpdateAsync(userFound);
                return mapper.Map<UserDTO>(userFound);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task ForgotPassword(string email)
        {
            var user = await repository.GetUser(email) ?? throw new NotFoundException("forgotPasswordService.userNotFound");
            bool tokenFounded = repository.ResetPasswordTokenIsValidAndExists(user);

            if (tokenFounded) throw new ConflictException("forgotPasswordService.resetLinkAlreadyCreated");

            UserToken token = new()
            {
                UserId = user.Id,
                Token = Guid.NewGuid().ToString(),
                TokenType = TokenType.PasswordReset,
                ExpiresAt = DateTime.Now.AddHours(1),
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
            var user = await repository.GetUser(userId) ?? throw new NotFoundException("deleteProfileService.userNotFound");

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
                user.EmailConfirmed = true;
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
                throw new BadRequestException("resetPasswordService.passwordsMustMatch");

            var (user, userToken) = await ValidateUserAndUserToken(token);

            if (BCrypt.Net.BCrypt.Verify(resetPasswordDTO.NewPassword, user.Password))
                throw new BadRequestException("resetPasswordService.newPasswordSameAsOld");

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
            var userToken = await repository.GetUserToken(token) ?? throw new NotFoundException("validateUserTokenService.invalidTokenNotFound");

            bool isValid = repository.IsUserTokenValid(userToken);
            if (!isValid) throw new BadRequestException("validateUserTokenService.invalidToken");

            var user = await repository.GetUser(userToken.UserId) ?? throw new NotFoundException("validateUserTokenService.userNotFound");

            return (user, userToken);
        }

        public async Task SeedDatabaseWithUserToken(TokenType tokenType)
        {
            if (tokenType == TokenType.EmailVerification)
            {
                var token = new UserToken
                {
                    TokenType = TokenType.EmailVerification,
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddDays(2),
                    Id = Guid.Parse("0c9a678a-54d8-4ce5-96fe-159ffac076c0"),
                    Token = "25f78624-0c9b-4b63-b61e-d5b297e56f82",
                    UserId = Guid.Parse("6fe71ee1-830f-4e00-8257-cd3591423505")
                };

                var user = await repository.GetUser(token.UserId) ?? throw new NotFoundException("User not found.");
                user.EmailConfirmed = false;

                await repository.SeedTestingDatabaseUserToken(token, user);
            }
            else if (tokenType == TokenType.PasswordReset)
            {
                var token = new UserToken
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddDays(2),
                    UserId = Guid.Parse("8d3716ab-ae98-473f-9a6b-5d53b8d46682"),
                    TokenType = TokenType.PasswordReset,
                    Token = "5508116c-f287-4e54-8e9d-b556fdc9eeeb",
                };

                var user = await repository.GetUser(token.UserId) ?? throw new NotFoundException("User not found.");
                user.Password = BCrypt.Net.BCrypt.HashPassword("Password&123456", 12);

                await repository.SeedTestingDatabaseUserToken(token, user);
            }
            else
            {
                throw new BadRequestException("Invalid token type sent.");
            }
        }

        public async Task SeedDatabaseWithUser()
        {
            var userExist = await repository.GetUser("user-testing-to-delete@example.com");
            if (userExist != null) throw new ConflictException("User already created.");


            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = "User To Delete",
                CreatedAt = DateTime.Now,
                Email = "user-testing-to-delete@example.com",
                EmailConfirmed = true,
                Password = BCrypt.Net.BCrypt.HashPassword("Password&123456")
            };
            await repository.SeedTestingDatabaseUser(user);
        }
    }
}
