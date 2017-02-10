namespace Gaia.Core.Domain.Mail
{
    using global::System;
    using global::System.Linq;


    public class AccountVerification: BaseMailModel
    {
        public string VerificationUrl { get; set; }

        public string Target
        {
            get { return Recipients.FirstOrDefault(); }
            set { Recipients = new[] { value }; }
        }

        public DateTime ExpiryDate { get; set; }
    }
}
