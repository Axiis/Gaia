using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class SystemSetting: GaiaEntity<long>
    {
        public enum CommonDataType
        {
            String,
            Integer,
            Float,
            Boolean,
            Binary,

            DateTime,
            TimeSpan,
            Url,

            Object
        }

        public virtual string Data
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string Name
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual CommonDataType Type
        {
            get { return get<CommonDataType>(); }
            set { set(ref value); }
        }


        public SystemSetting()
        {
        }
    }
}
