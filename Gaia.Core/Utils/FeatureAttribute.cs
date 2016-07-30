using static Axis.Luna.Extensions.ExceptionExtensions;

using System;

namespace Gaia.Core.Utils
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class FeatureAttribute : Attribute
    {
        public string URI { get; private set; }
        public string Name { get; private set; }

        public FeatureAttribute(string uri, string name = null)
        {
            this.URI = uri.ThrowIf(d => string.IsNullOrWhiteSpace(d), new Exception("invalid descriptor-uri specified"));
            this.Name = name;
        }
    }
}
