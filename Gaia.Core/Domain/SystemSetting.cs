using Axis.Luna;
using System;
using static Axis.Luna.Extensions.ObjectExtensions;

namespace Gaia.Core.Domain
{
    public class SystemSetting: GaiaEntity<long>, IDataItem
    {
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

        public override string ToString() => $"[{Name}: {DisplayData()}]";

        private string DisplayData()
        {
            switch (Type)
            {
                case CommonDataType.Boolean:
                case CommonDataType.Real:
                case CommonDataType.Integer:
                case CommonDataType.String:
                case CommonDataType.Url:
                case CommonDataType.TimeSpan:
                case CommonDataType.JsonObject: return Data;
                case CommonDataType.DateTime: return Eval(() => DateTime.Parse(Data).ToString(), ex => "");

                case CommonDataType.Binary: return "Binary-Data";

                case CommonDataType.UnknownType:
                default: return "Unknown-Type";
            }
        }


        public SystemSetting()
        {
        }
    }
}
