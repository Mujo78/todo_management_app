using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using server.Services.IService;
using server.Utils.Email;

namespace server.Services
{
    public class MailService(IOptions<MailSettings> settings) : IMailService
    {
        private readonly MailSettings _settings = settings.Value;

        public async Task SendMailAsync(MailData mailData)
        {
            MimeMessage emailMessage = new();
            MailboxAddress emailFrom = new(_settings.SenderName, _settings.SenderEmail);
            emailMessage.From.Add(emailFrom);
            MailboxAddress emailTo = new(mailData.EmailToName, mailData.EmailToId);
            emailMessage.To.Add(emailTo);

            emailMessage.Subject = mailData.EmailSubject;

            BodyBuilder emailBodyBuilder = new()
            {
                TextBody = mailData.EmailBody
            };

            emailMessage.Body = emailBodyBuilder.ToMessageBody();

            SmtpClient mailClient = new();
            await mailClient.ConnectAsync(_settings.Server, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            await mailClient.AuthenticateAsync(_settings.UserName, _settings.Password);
            await mailClient.SendAsync(emailMessage);
            await mailClient.DisconnectAsync(true);
        }
        public async Task SendDeleteMailAsync(string email, string name)
        {
            try
            {
                MailData data = new()
                {
                    EmailToId = email,
                    EmailToName = name,
                    EmailSubject = "Goodbye Email",
                    EmailBody = $"You have successfully deleted your profile",
                };

                await SendMailAsync(data);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task SendForgotPasswordMailAsync(string email, string name, string token)
        {
            try
            {
                MailData data = new()
                {
                    EmailToId = email,
                    EmailToName = name,
                    EmailSubject = "Password Reset Request",
                    EmailBody = $"Reset your password by clicking on the button below or with link provided. Link: {token}",
                };

                await SendMailAsync(data);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task SendVerificationMailAsync(string email, string name, string token)
        {
            try
            {
                MailData data = new()
                {
                    EmailToId = email,
                    EmailToName = name,
                    EmailSubject = "Email Verification",
                    EmailBody = $"Verify your email address with the button below, or with the link. Token: {token}",
                };

                await SendMailAsync(data);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task SendWelcomeMailAsync(string email, string name)
        {
            try
            {
                MailData data = new()
                {
                    EmailToId = email,
                    EmailToName = name,
                    EmailSubject = "Welcome Message",
                    EmailBody = $"Dear {name}, \n Welcome to the ToDo Management System.",
                };

                await SendMailAsync(data);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
