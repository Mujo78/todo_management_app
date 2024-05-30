using server.Utils.Email;

namespace server.Services.IService
{
    public interface IMailService
    {
        Task SendMailAsync(MailData mailData);
        Task<bool> SendVerificationMailAsync(string email, string name, string token);
        Task<bool> SendWelcomeMailAsync(string email, string name);
        Task<bool> SendForgotPasswordMailAsync(string email, string name, string token);
        Task<bool> SendDeleteMailAsync(MailData mailData);
    }
}
