using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using static Axis.Luna.Extensions.EnumerableExtensions;

namespace Gaia.Server.Utils
{
    public static class Constants
    {
        public static JsonSerializerSettings DefaultJsonSerializerSettings = new JsonSerializerSettings
        {
            Converters = Enumerate<JsonConverter>()
                .Append(new Axis.Apollo.Json.TimeSpanConverter())
                .Append(new Axis.Apollo.Json.DateTimeConverter())
                .ToList(),
            MissingMemberHandling = MissingMemberHandling.Ignore,
            NullValueHandling = NullValueHandling.Ignore,
            ObjectCreationHandling = ObjectCreationHandling.Auto,
            FloatFormatHandling = FloatFormatHandling.DefaultValue,
            PreserveReferencesHandling = PreserveReferencesHandling.Objects,
            StringEscapeHandling = StringEscapeHandling.Default
        };


        /// <summary>
        /// Default Owin token expiration
        /// </summary>
        public static readonly TimeSpan TokenExpiryInterval = TimeSpan.FromHours(1);
    }
}