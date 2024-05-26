using server.Utils.Email;

namespace server.Services.IService
{
    public interface IMailService
    {
        Task<bool> SendMailAsync(MailData mailData);
    }
}
