using server.Utils.Email;

namespace server.Services.IService
{
    public interface IMailService
    {
        Task SendMailAsync(MailData mailData);
        Task SendVerificationMailAsync(string email, string name, string token);
        Task SendWelcomeMailAsync(string email, string name);
        Task SendForgotPasswordMailAsync(string email, string name, string token);
        Task SendDeleteMailAsync(string email, string name);
    }
}
