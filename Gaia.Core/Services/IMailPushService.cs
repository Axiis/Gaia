using Axis.Luna;
using Gaia.Core.Domain.Mail;
using Gaia.Core.Services;
using Gaia.Core.System;
using Mail = System.Net.Mail;

namespace Gaia.Core.Services
{
    public interface IMailPushService : IGaiaService, IUserContextAware
    {
        Operation Push<Mail>(Mail mail) where Mail : BaseMailModel;
    }
    
}
