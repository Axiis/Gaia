using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class SystemSetting: GaiaEntity<long>
    {
        public virtual string StringData
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
        public virtual byte[] BinaryData
        {
            get { return get<byte[]>(); }
            set { set(ref value); }
        }

        public virtual string Name
        {
            get { return get<string>(); }
            set { set(ref value); }
        }


        public SystemSetting()
        {
        }
    }
}
