using Axis.Luna;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain
{
    public class Blob: GaiaEntity<long>
    {
        public string Data { get; set; }
        public bool IsDataEmbeded { get; set; }
        public string Name { get; set; }

        public string Context { get; set; }

        public BinaryData ToBinaryData() => new BinaryData
        {
            Data = Data,
            IsDataEmbeded = IsDataEmbeded,
            Name = Name
        };
    }
}
