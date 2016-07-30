using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.Meta
{
    public class FeatureURI: GaiaEntity<int>
    {
        public virtual string URI
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string Name
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
    }
}
