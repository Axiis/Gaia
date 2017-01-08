using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.EnumerableExtensions;

using System;
using System.Collections.Generic;
using Axis.Luna;
using Gaia.Core.Domain;
using Axis.Jupiter;
using Gaia.Core.Utils;
using System.Linq;
using Axis.Pollux.Identity.Principal;

namespace Gaia.Core.Services
{
    public class ContextVerificationService : IContextVerificationService
    {
        public IUserContextService UserContext { get; private set; }
        public IDataContext DataContext { get; private set; }


        public ContextVerificationService(IUserContextService userContext, IDataContext dataContext)
        {
            ThrowNullArguments(() => userContext, () => dataContext);

            this.UserContext = userContext;
            this.DataContext = dataContext;
        }

        public Operation<ContextVerification> CreateVerificationObject(string userId, string verificationContext)
            => FeatureAccess.Guard(UserContext, () => CreateVerificationObject(userId, verificationContext, null));

        public Operation<ContextVerification> CreateVerificationObject(string userId, string verificationContext, DateTime? expiryDate)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var defaultExpiration = DataContext.Store<SystemSetting>().Query
                                                   .FirstOrDefault(_st => _st.Name == System.SystemSettings.DefaultContextVerificationExpiration.Key)
                                                   .ThrowIfNull("could not find system setting");

                var cvstore = DataContext.Store<ContextVerification>();
                if (!DataContext.Store<User>().Query.Any(_u => _u.EntityId == userId)) throw new Exception("could not find user");
                return cvstore.NewObject().UsingValue(_cv =>
                {
                    _cv.CreatedBy = UserContext.CurrentUser.UserId;
                    _cv.Context = verificationContext;
                    _cv.ExpiresOn = expiryDate ?? (DateTime.Now + TimeSpan.Parse(defaultExpiration.Data));
                    _cv.UserId = userId;
                    _cv.VerificationToken = GenerateToken();
                    _cv.Verified = false;

                    cvstore.Add(_cv).Context.CommitChanges();
                });
            });

        public Operation VerifyContext(string userId, string verificationContext, string token)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var cvstore = DataContext.Store<ContextVerification>();
                cvstore.Query
                       .Where(_cv => _cv.UserId == userId)
                       .Where(_cv => _cv.Context == verificationContext)
                       .Where(_cv => _cv.VerificationToken == token)
                       .Where(_cv => _cv.Verified == false)
                       .FirstOrDefault()
                       .ThrowIfNull("verification token is invalid")
                       .Do(_cv =>
                       {
                           _cv.Verified = true;
                           cvstore.Modify(_cv, true);
                       });
            });

        private string GenerateToken() => RandomAlphaNumericGenerator.RandomAlphaNumeric(50);
    }
}
