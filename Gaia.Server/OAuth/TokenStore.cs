using Axis.Luna;
using Axis.Luna.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Gaia.Server.OAuth
{
    //public class TokenManager
    //{
    //    private TokenContext _context = new TokenContext();

    //    public Operation ValidateAccessCode(string code, string clientInfo)
    //        => Operation.Try(() =>
    //        {
    //            _context.AccessCodes
    //                    .FirstOrDefault(_ac => _ac.AccessCode == code && _ac.ClientInfo == clientInfo)
    //                    .ThrowIf(_ac => _ac == null, "Invalid Access-Code")
    //                    .ThrowIf(_ac => _ac.IsExchanged, "Invalid Access-Code")
    //                    .ThrowIf(_ac => _ac.ExpiresOn <= DateTime.Now, "Access-Code Expired");
    //        });

    //    public Operation ValidateAccessToken(string token, string clientInfo)
    //        => Operation.Try(() =>
    //        {
    //            _context.AccessTokens
    //                    .FirstOrDefault(_at => _at.Token == token && _at.ClientInfo == clientInfo)
    //                    .ThrowIf(_at => _at == null, "Invalid Access-Token")
    //                    .ThrowIf(_at => _at.ExpiresOn <= DateTime.Now, "Access-Token Expired");
    //        });

    //    public Operation<AccessToken> ExchangeAccessCode(string code, string clientInfo, TimeSpan validPeriod)
    //        => ValidateAccessCode(code, clientInfo).Then(op =>
    //        {
    //            return _context.AccessTokens.Create().With(new
    //            {
    //                ClientInfo = clientInfo,
    //                ExpiresOn = DateTime.Now + validPeriod,
    //                Token = "" //generate token
    //            })
    //            .UsingValue(_token => _context.AccessTokens.Add(_token))
    //            .UsingValue(_token => _context.SaveChanges());
    //        });
    //}

    //public class ThirdPartyAccessCode
    //{
    //    [MaxLength(256)]
    //    public string AccessCode { get; set; }

    //    public DateTime? ExpiresOn { get; set; }

    //    public bool IsExchanged { get; set; }

    //    [Key]
    //    public long Id { get; set; }

    //    public string ClientInfo { get; set; }
    //}

    //public class AccessToken
    //{
    //    [Key]
    //    public long Id { get; set; }

    //    public string Token { get; set; }
    //    public DateTime? ExpiresOn { get; set; }

    //    public string ClientInfo { get; set; }
    //}

    //public class Configuration
    //{
    //    [Key]
    //    public long Id { get; set; }

    //    [MaxLength(400)]
    //    [Index(IsClustered = false, IsUnique = true)]
    //    public string Name { get; set; }

    //    public CommonDataType Type { get; set; }

    //    public string Data { get; set; }
    //}

    //public enum CommonDataType
    //{
    //    String,
    //    Integer,
    //    Float,
    //    Boolean,
    //    Binary,

    //    DateTime,
    //    TimeSpan,
    //    Url,

    //    Object
    //}



    //public class TokenStore: DbContext
    //{
    //    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    //    {
    //        base.OnModelCreating(modelBuilder);

    //        //seed the database
    //    }

    //    #region data sets
    //    public IDbSet<AccessToken> AccessTokens { get; set; }
    //    public IDbSet<ThirdPartyAccessCode> AccessCodes { get; set; }
    //    public IDbSet<Configuration> Settings { get; set; }
    //    #endregion

    //    #region Token Store Settings

    //    public static readonly string TokenExpiration = "Gaia.TokenExpiration";

    //    #endregion
    //}
}