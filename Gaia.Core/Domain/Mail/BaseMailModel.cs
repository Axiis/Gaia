using System.Collections.Generic;

namespace Gaia.Core.Domain.Mail
{
    public abstract class BaseMailModel
    {
        public string From { get; set; }
        public string Subject { get; set; }

        private List<string> _recipients = new List<string>();
        public IEnumerable<string> Recipients
        {
            get { return _recipients; }
            set
            {
                _recipients.Clear();
                if (value != null) _recipients.AddRange(value);
            }
        }
    }
}
