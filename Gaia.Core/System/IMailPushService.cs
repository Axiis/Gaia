using Axis.Luna;
using Gaia.Core.Services;
using Mail = System.Net.Mail;

namespace Gaia.Core.System
{
    public interface IMailPushService : IGaiaService, IUserContextAware
    {
        AsyncOperation Push(Mail.MailMessage mail);
    }
    
}
