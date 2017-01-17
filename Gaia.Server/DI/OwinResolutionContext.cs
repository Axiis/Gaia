namespace Gaia.Server.DI
{
    using static Axis.Luna.Extensions.ExceptionExtensions;
    using static Axis.Luna.Extensions.ObjectExtensions;

    using Axis.Luna;
    using SimpleInjector;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http.Dependencies;
    using Microsoft.Owin;
    using SimpleInjector.Extensions.ExecutionContextScoping;
    using Owin;
    using Microsoft.Owin.BuilderProperties;
    using System.Threading;
    using System.Web.Http.Controllers;
    using Microsoft.Owin.Extensions;

    public class SimpleInjectorOwinResolutionContext : IResolutionScopeProvider, IDependencyResolver
    {
        private Container _container = null;

        public Container Container => _container;

        public SimpleInjectorOwinResolutionScope NewResolutionScope(IOwinContext context) 
            => new SimpleInjectorOwinResolutionScope(_container.BeginExecutionContextScope()) { Owin = context };

        public IDependencyScope BeginScope() => new SimpleInjectorOwinResolutionScope(_container.GetCurrentExecutionContextScope());

        public IServiceResolver ResolutionScope() => ResolutionScope(null);

        public IServiceResolver ResolutionScope(object parameter) => BeginScope() as IServiceResolver;



        public object GetService(Type serviceType) => Eval(() => _container.GetInstance(serviceType));

        public IEnumerable<object> GetServices(Type serviceType) => Eval(() => _container.GetAllInstances(serviceType)) ?? new object[0];


        #region Dispose
        private bool disposed = false;
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (disposed) return;

            if (disposing)
            {
                _container.Dispose();
            }

            disposed = true;
        }
        #endregion

        public SimpleInjectorOwinResolutionContext(ScopedLifestyle lifeStyle, Action<Container> serviceRegistration)
        {
            ThrowNullArguments(() => serviceRegistration);

            _container = new Container();
            _container.Options.DefaultScopedLifestyle = lifeStyle;

            //register the OwinContext
            Eval(() => _container.Register(() => _container.GetCurrentExecutionContextScope().GetItem(SimpleInjectorOwinResolutionScope.OwinContextScopeKey).As<IOwinContext>(),
                                           Lifestyle.Scoped));

            serviceRegistration.Invoke(_container);
        }
    }

    public class SimpleInjectorOwinResolutionScope: IServiceResolver, IDependencyScope
    {
        public static readonly string OwinContextScopeKey = "Gaia.OwinContext";

        private Scope _scope = null;

        public IOwinContext Owin
        {
            get { return _scope.GetItem(OwinContextScopeKey).As<IOwinContext>(); }
            set { _scope.SetItem(OwinContextScopeKey, value); }
        }

        #region init
        public SimpleInjectorOwinResolutionScope(Scope scope)
        {
            _scope = scope;
        }
        #endregion


        public object Resolve(Type serviceType, params object[] args)
        {
            // By calling GetInstance instead of GetService when resolving a controller, we prevent the
            // container from returning null when the controller isn't registered explicitly and can't be
            // created because of an configuration error. GetInstance will throw a descriptive exception
            // instead. Not doing this will cause Web API to throw a non-descriptive "Make sure that the 
            // controller has a parameterless public constructor" exception.
            if (!serviceType.IsAbstract && typeof(IHttpController).IsAssignableFrom(serviceType)) return _scope.GetInstance(serviceType);

            else return Eval(() => _scope.GetInstance(serviceType));
        }
        public Service Resolve<Service>(params object[] args) => Resolve(typeof(Service)).As<Service>();
        public object GetService(Type serviceType) => Resolve(serviceType);

        public IEnumerable<object> ResolveAll(Type serviceType, params object[] args)
        {
            var service = Resolve(serviceType);
            if (service == null) return new object[0];
            else return new[] { service };
        }
        public IEnumerable<Service> ResolveAll<Service>(params object[] args) => ResolveAll(typeof(Service)).Cast<Service>();
        public IEnumerable<object> GetServices(Type serviceType) => ResolveAll(serviceType);


        #region Dispose
        private bool disposed = false;
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (disposed) return;

            if (disposing)
            {
                Owin = null;
                _scope.Dispose();
            }
            
            disposed = true;
        }
        #endregion
    }

    public static class SimpleInjectorOwinResolutionContextConfiguraiton
    {
        private static readonly string OWINResolutionContext = "Gaia.Server.OWIN.ResolutionContext";

        public static SimpleInjectorOwinResolutionContext GetSimpleInjectorOwinResolutionContext(this IAppBuilder app)
            => Eval(() => app.Properties[OWINResolutionContext] as SimpleInjectorOwinResolutionContext);

        public static IAppBuilder UseSimpleInjectorOwinResolutionContext(this IAppBuilder app, ScopedLifestyle lifestyle, Action<Container> serviceRegistration)
        {
            if (app.GetSimpleInjectorOwinResolutionContext() == null)
            {
                //set the owin resolution context
                app.Properties[OWINResolutionContext] = new SimpleInjectorOwinResolutionContext(lifestyle, serviceRegistration);

                //shutdown delegate
                var token = new AppProperties(app.Properties).OnAppDisposing;
                if (token != CancellationToken.None)
                    token.Register(() => app.GetSimpleInjectorOwinResolutionContext().Dispose());

                //setup the middleware
                return app.Use(async (context, next) =>
                {
                    var x = app;
                    //create the scope that will be used throughout the request lifecycle
                    using (var scope = app.GetSimpleInjectorOwinResolutionContext().NewResolutionScope(context))
                    {
                        await next();
                    }
                });
            }

            return app;
        }
    }
}