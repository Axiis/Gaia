using Gaia.Core.Services;
using Gaia.Core.System;
using System;
using System.Linq;
using Axis.Luna;
using Gaia.Core.Domain.Mail;
using System.Net.Mail;

using Axis.Luna.Extensions;
using System.IO;
using System.Web.Hosting;
using RazorEngine.Templating;
using RazorEngine;
using CAIRO.ElasticEmail;
using System.Configuration;

namespace Gaia.Server.Services
{
    public class ElasticMailPush : BaseService, IMailPushService
    {        
        private static bool _cached;

        private string _apikey = null;


        #region Init
        public ElasticMailPush()
        {
            _apikey = ConfigurationManager.AppSettings["ElasticEmail.APIKey"];
        }

        private void CacheTemplates()
        {
            lock (typeof(ElasticMailPush))
            {
                if (!_cached)
                {
                    var mailModelType = typeof(BaseMailModel);
                    //find all email models in the application
                    AppDomain.CurrentDomain.GetAssemblies()
                        .SelectMany(_ass => _ass.GetTypes())
                        .Where(_type => _type != mailModelType)
                        .Where(_type => !_type.IsAbstract && !_type.IsGenericTypeDefinition)
                        .Where(_type => mailModelType.IsAssignableFrom(_type))
                        .ToList()
                        .ForEach(_type =>
                        {
                            //compile and cache the mail models
                            var templateSource = new MailModelTemplateSource(_type);
                            Engine.Razor.Compile(templateSource, templateSource.Name, _type);
                        });
                    _cached = true;
                }
            }
        }
        #endregion

        /// <summary>
        /// Send the Email
        /// </summary>
        /// <param name="model">Mail to Send</param>
        /// <returns>Operation</returns>
        public Operation Push<Mail>(Mail model)
        where Mail: BaseMailModel => Operation.Try(() =>
        {
            CacheTemplates();

            var modelType = typeof(Mail);
            var mail = new ElasticemailMessage
            {
                From = new MailAddress(model.From),
                Subject = model.Subject.ThrowIfNull("invalid mail subject"),
                IsBodyHtml = true,
                Body = Engine.Razor.Run(MailModelTemplateSource.TemplateName(modelType), modelType, model),
            };
            model.Recipients.ForAll((_cnt, _r) => mail.To.Add(new MailAddress(_r)));

            new ElasticemailWebApi(_apikey)
                .Send(mail)
                .ThrowIf(_r => _r.ResultType == ResultType.Error, _r => new Exception(_r.ErrorMessage));
        });


        /// <summary>
        /// 
        /// </summary>
        public class MailModelTemplateSource : ITemplateSource
        {
            internal MailModelTemplateSource(Type modelType)
            {
                ModelType = modelType;

                TemplateFile = HostingEnvironment.MapPath($"~/Views/Email/{TemplateFileName(modelType)}.cshtml");
            }

            private Type ModelType { get; set; }

            public string Name => TemplateName(ModelType);

            public string Template { get; private set; }

            public string TemplateFile { get; private set; }

            public TextReader GetTemplateReader()
            {
                if (string.IsNullOrWhiteSpace(Template))
                {
                    using (var reader = new StreamReader(new FileInfo(TemplateFile).OpenRead()))
                        Template = reader.ReadToEnd();
                }

                return new StringReader(Template);
            }

            public static string TemplateName(Type modelType)
            {
                if (modelType.IsAbstract ||
                    modelType.IsGenericTypeDefinition ||
                    !typeof(BaseMailModel).IsAssignableFrom(modelType))
                    throw new Exception("Invalid mail model type supplied");

                else return $"{modelType.Namespace}_{modelType.Name}".Replace(".", "_");
            }

            public static string TemplateFileName(Type modelType) => modelType.Name.TrimEnd("MailModel");
        }
    }
}