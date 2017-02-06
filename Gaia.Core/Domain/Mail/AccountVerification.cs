namespace Gaia.Core.Domain.Mail
{
    public class AccountVerification: BaseMailModel
    {
        public string VerificationUrl { get; set; }
    }
}
