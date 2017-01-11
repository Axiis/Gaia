using Gaia.Core.Services;
using System;
using Axis.Luna;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Hosting;

namespace Gaia.Server.Services
{
    public class FileSystemBlobStore : IBlobStoreService
    {
        /// <summary>
        /// 
        /// </summary>
        public string RootDirecotry => Path.Combine(RefererRequest.RootDirectory(), "Content/Blob"); // ~/Content/Blob

        /// <summary>
        /// 
        /// </summary>
        public IRefererUrlProvider RefererRequest { get; private set; }

        public IUserContextService UserContext { get; private set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="refererRequest"></param>
        public FileSystemBlobStore(IRefererUrlProvider refererRequest, IUserContextService userContextService)
        {
            RefererRequest = refererRequest;
            UserContext = userContextService;

            //create the root dir
            var dinfo = new DirectoryInfo(RootDirecotry);
            if (!dinfo.Exists) dinfo.Create();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="blobUri"></param>
        /// <returns></returns>
        public Operation Delete(Uri blobUri)
            => Operation.Try(() =>
            {
                var finfo = new FileInfo(GetLocalPath(blobUri));
                if (finfo.Exists) finfo.Delete();
            });

        /// <summary>
        /// 
        /// </summary>
        /// <param name="blobUri"></param>
        /// <returns></returns>
        public Operation<EncodedBinaryData> GetBlob(Uri blobUri)
            => Operation.Try(() =>
            {
                var finfo = new FileInfo(GetLocalPath(blobUri));
                return new EncodedBinaryData(finfo.OpenRead() as Stream, MimeMap.ToMime(finfo.Extension));
            });

        /// <summary>
        /// 
        /// </summary>
        /// <param name="blob"></param>
        /// <param name="blobMime"></param>
        /// <param name="subDirectory"></param>
        /// <returns></returns>
        public Operation<Uri> Persist(EncodedBinaryData blob)
            => Operation.Try(() =>
            {
                var mime = blob.MimeObject();
                var fileName = $"{RandomAlphaNumericGenerator.RandomAlphaNumeric(40)}{mime.Extension}";

                DirectoryInfo dinfo = new DirectoryInfo(RootDirecotry);

                using (var stream = new FileInfo(Path.Combine(dinfo.FullName, fileName)).OpenWrite())
                    stream.Write(blob.Data, 0, blob.Data.Length);

                return new Uri($"{RefererRequest.RefererUri().Scheme}://{RefererRequest.RefererUri().Authority}/Content/Blob/{fileName}");
            });


        internal string GetLocalPath(Uri uri)
        {
            var path = Regex.Replace(uri.PathAndQuery, "\\/Content\\/Blob\\/", "", RegexOptions.IgnoreCase);
            return Path.Combine(RootDirecotry, path);
        }
        
    }

    /// <summary>
    /// 
    /// </summary>
    public interface IRefererUrlProvider
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        Uri RefererUri();
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        string RootDirectory();
    }

    /// <summary>
    /// 
    /// </summary>
    public class OWINRefererUrlProvier : IRefererUrlProvider
    {
        private IOwinContextProvider _owinContextProvider;

        public OWINRefererUrlProvier(IOwinContextProvider owinContextProvider)
        {
            _owinContextProvider = owinContextProvider;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public Uri RefererUri() => _owinContextProvider.OwinContext.Request.Uri;
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public string RootDirectory() => HostingEnvironment.MapPath("~/");
    }
}