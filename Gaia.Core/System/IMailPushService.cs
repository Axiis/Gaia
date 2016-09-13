using Axis.Luna;
using Mail = System.Net.Mail;

namespace Gaia.Core.System
{
    public interface IMailPushService: IUserContextAware
    {
        AsyncOperation Push(Mail.MailMessage mail);
    }
    
}
