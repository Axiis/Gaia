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
            => FeatureAccess.Guard(UserContext, () =>
            {
                var defaultExpiration = DataContext.Store<SystemSetting>().Query
                                                   .FirstOrDefault(_st => _st.Name == System.SystemSettings.DefaultContextVerificationExpiration.Key)
                                                   .ThrowIfNull("could not find system setting");

                return CreateVerificationObject(userId, verificationContext, DateTime.Now + TimeSpan.Parse(defaultExpiration.Data));
            });

        public Operation<ContextVerification> CreateVerificationObject(string userId, string verificationContext, DateTime expiryDate)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var cvstore = DataContext.Store<ContextVerification>();
                if (!DataContext.Store<User>().Query.Any(_u => _u.UserId == userId)) throw new Exception("could not find user");
                return cvstore.NewObject().With(new
                {
                    CreatedBy = UserContext.CurrentUser.UserId,
                    Context = verificationContext,
                    ExpiryDate = expiryDate,
                    UserId = userId,
                    VerificationToken = GenerateToken(),
                    Verified = false
                })
                .UsingValue(_cv => cvstore.Add(_cv).Context.CommitChanges());
            });

        public Operation VerifyContext(string userId, string verificationContext, string token)
            => FeatureAccess.Guard(UserContext, () =>
            {
                var cvstore = DataContext.Store<ContextVerification>();
                cvstore.Query
                       .Where(_cv => _cv.UserId == userId)
                       .Where(_cv => _cv.Context == verificationContext)
                       .Where(_cv => _cv.VerificationToken == token)
                       .FirstOrDefault()
                       .ThrowIfNull("could not find verification object")
                       .Do(_cv => cvstore.Modify(_cv.With(new { Verified = true }), true));
            });

        private string GenerateToken() => RandomAlphaNumericGenerator.RandomAlphaNumeric(50);
    }
}
