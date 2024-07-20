using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using server.Services.IService;
using server.Utils.Email;
using System.Reflection;

namespace server.Services
{
    public class MailService(IOptions<MailSettings> settings, IConfiguration configuration) : IMailService
    {
        private readonly MailSettings _settings = settings.Value;
        private readonly IConfiguration configuration = configuration;

        public async Task SendMailAsync(MailData mailData, BodyBuilder emailBodyBuilder)
        {
            MimeMessage emailMessage = new();
            MailboxAddress emailFrom = new(_settings.SenderName, _settings.SenderEmail);
            emailMessage.From.Add(emailFrom);
            MailboxAddress emailTo = new(mailData.EmailToName, mailData.EmailToId);
            emailMessage.To.Add(emailTo);

            emailMessage.Subject = mailData.EmailSubject;

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
                    EmailSubject = "Profile Deleted",
                    EmailBody = "Your account has been successfully deleted from the ToDo Management System. We're sad to see you leave, but we understand that sometimes priorities change.",
                };
                string filePath = GetTemplatePath("DeleteProfile.html");
                string emailTemplateText = File.ReadAllText(filePath);
                
                BodyBuilder emailBodyBuilder = new()
                {
                    HtmlBody = emailTemplateText,
                    TextBody = data.EmailBody
                };
                await SendMailAsync(data, emailBodyBuilder);
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
                string verificationLink = configuration["URL"] + $"password-reset/{token}";

                MailData data = new()
                {
                    EmailToId = email,
                    EmailToName = name,
                    EmailSubject = "Password Reset Request",
                    EmailBody = $"Hi {name},\nForgot your password?\n" +
                    $"We received a request to reset the password for your account\n" +
                    $"To reset your password, click on the button below:\n" +
                    $"{verificationLink}",
                };
                string filePath = GetTemplatePath("ForgotPassword.html");
                string emailTemplateText = File.ReadAllText(filePath);

                emailTemplateText = emailTemplateText.Replace("{{Name}}", data.EmailToName);
                emailTemplateText = emailTemplateText.Replace("{{Link}}", verificationLink);

                BodyBuilder emailBodyBuilder = new()
                {
                    HtmlBody = emailTemplateText,
                    TextBody = data.EmailBody
                };
                await SendMailAsync(data, emailBodyBuilder);
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
                string verificationLink = configuration["URL"] + $"verify-email/{token}";

                MailData data = new()
                {
                    EmailToId = email,
                    EmailToName = name,
                    EmailSubject = "Email Verification",
                    EmailBody = $"Verify your email address with with the link: {verificationLink}",
                };

                string filePath = GetTemplatePath("VerifyEmail.html");
                string emailTemplateText = File.ReadAllText(filePath);

                emailTemplateText = emailTemplateText.Replace("{{Name}}", data.EmailToName);
                emailTemplateText = emailTemplateText.Replace("{{VerificationLink}}", verificationLink);

                BodyBuilder emailBodyBuilder = new()
                {
                    HtmlBody = emailTemplateText,
                    TextBody = data.EmailBody
                };

                await SendMailAsync(data, emailBodyBuilder);
            }
            catch (Exception ex)
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
                    EmailBody =
                        $"Welcome to the ToDo Management System.\n\n" +
                        $"We are happy to have you on board. Within the system, you can create, update, delete and see all of your future plans and goals that you are ready to successfully accomplish. \n\n" +
                        $"Don't hesitate to get in touch if you have any questions. We will always get back to you. :)",
                };
                string filePath = GetTemplatePath("Welcome.html");
                string emailTemplateText = File.ReadAllText(filePath);

                BodyBuilder emailBodyBuilder = new()
                {
                    HtmlBody = emailTemplateText,
                    TextBody = data.EmailBody
                };
                await SendMailAsync(data, emailBodyBuilder);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private string GetTemplatePath(string templateName)
        {
            var pathTemp = configuration.GetValue<string>("TemplatePath");
            string templatePath = Path.Combine(pathTemp!, templateName);
            return templatePath;
        }
    }
}
