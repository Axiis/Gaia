using Gaia.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Axis.Luna;
using Axis.Pollux.Identity.Principal;
using Gaia.Core.Domain;

using static Axis.Luna.Extensions.ExceptionExtensions;

namespace Gaia.Server.Services
{
    public class BlobService : IBlobService
    {
        private IUserContextService _userContext = null;

        public BlobService(IUserContextService userContext)
        {
            ThrowNullArguments(() => userContext);

            _userContext = userContext;
        }

        public User CurrentUser => _userContext.CurrentUser;



        public Operation Delete(Uri blobUri)
        {
            throw new NotImplementedException();
        }

        public Operation<EncodedBinaryData> GetBlob(Uri blobUri)
        {
            throw new NotImplementedException();
        }

        public Operation<Uri> Persist(EncodedBinaryData blob)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<FeatureAccessProfile> UserAccessProfiles()
        {
            throw new NotImplementedException();
        }
    }
}