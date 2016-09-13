using System;
using System.Net.Mail;
using Axis.Luna;

namespace Gaia.Core.Services.Utils
{
    public class MailClient1 : BaseService, System.IMailPushService
    {
        public AsyncOperation Push(MailMessage mail)
        {
            throw new NotImplementedException();
        }
    }
}
