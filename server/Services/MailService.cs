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

        public async Task<bool> SendMailAsync(MailData mailData)
        {
            try
            {
                using MimeMessage emailMessage = new();
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

                using SmtpClient mailClient = new();
                await mailClient.ConnectAsync(_settings.Server, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await mailClient.AuthenticateAsync(_settings.UserName, _settings.Password);
                await mailClient.SendAsync(emailMessage);
                await mailClient.DisconnectAsync(true);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
