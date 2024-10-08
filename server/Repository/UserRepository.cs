﻿using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Repository.IRepository;
using server.Utils.Enums;

namespace server.Repository
{
    public class UserRepository(ApplicationDBContext db) : Repository<User>(db), IUserRepository
    {
        private readonly ApplicationDBContext db = db;

        public bool EmailAlreadyUsed(string email)
        {
            return db.Users.Any(n => n.Email.ToLower().Equals(email.ToLower()));
        }

        public bool EmailAlreadyUsed(string email, Guid? userId)
        {
            return db.Users.Any(n => n.Email.ToLower().Equals(email.ToLower()) && !n.Id.Equals(userId));
        }

        public async Task<User?> GetUser(Guid? userId)
        {
            return await db.Users.FirstOrDefaultAsync(n => n.Id.Equals(userId));
        }
        public async Task<User?> GetUser(string userEmail)
        {
            return await db.Users.FirstOrDefaultAsync(n => n.Email.Equals(userEmail));
        }

        public async Task ResetPassword(User user, UserToken token)
        {
            db.Users.Update(user);

            db.UserTokens.Remove(token);
            await db.SaveChangesAsync();
        }

        public async Task CreateResetPasswordToken(UserToken token)
        {
            await db.UserTokens.AddAsync(token);
            await db.SaveChangesAsync();
        }

        public async Task DeleteUser(User user)
        {
            var assignmentsToDelete = db.Assignments.Where(assignment => assignment.UserId.Equals(user.Id));
            db.Assignments.RemoveRange(assignmentsToDelete);

            var tokensToDelete = db.UserTokens.Where(token => token.UserId.Equals(user.Id));
            db.UserTokens.RemoveRange(tokensToDelete);

            var refreshToRemove = db.RefreshTokens.Where(refresh => refresh.UserId.Equals(user.Id)).ToList();
            db.RefreshTokens.RemoveRange(refreshToRemove);

            db.Users.Remove(user);

            await db.SaveChangesAsync();
        }

        public async Task CreateUserAsync(User user, string token)
        {
            var newUser = await db.Users.AddAsync(user);

            await db.UserTokens.AddAsync(new()
            {
                UserId = newUser.Entity.Id,
                Token = token,
                TokenType = TokenType.EmailVerification,
                CreatedAt = DateTime.Now,
                ExpiresAt = DateTime.Now.AddHours(24),
            });

            await db.SaveChangesAsync();
        }

        public bool IsUserTokenValid(UserToken token)
        {
            return token.ExpiresAt > DateTime.Now;
        }

        public async Task<UserToken?> GetUserToken(string token)
        {
            return await db.UserTokens.FirstOrDefaultAsync(n => n.Token.Equals(token));
        }

        public async Task VerifyEmailAddress(User user, UserToken token)
        {
            db.Users.Update(user);

            db.UserTokens.Remove(token);
            await db.SaveChangesAsync();
        }

        public bool ResetPasswordTokenIsValidAndExists(User user)
        {
            return db.UserTokens.Any(n => n.UserId.Equals(user.Id) && n.TokenType.Equals(TokenType.PasswordReset) && n.ExpiresAt > DateTime.Now);
        }

        public async Task SeedTestingDatabaseUserToken(UserToken userToken, User user)
        {
            await db.UserTokens.AddAsync(userToken);
            db.Users.Update(user);

            await db.SaveChangesAsync();
        }

        public async Task SeedTestingDatabaseUser(User user)
        {
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();
        }
    }
}
