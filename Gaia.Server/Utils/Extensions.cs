using Axis.Luna;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Gaia.Server.Utils
{
    public static class Extensions
    {
        public static IHttpActionResult OperationResult<V>(this Operation<V> operation, HttpRequestMessage request, HttpStatusCode? code = null)
            => new ApiOperationResult<V>(operation, request, code);
    }
}