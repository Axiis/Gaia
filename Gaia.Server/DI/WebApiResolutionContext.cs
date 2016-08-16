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
    using SimpleInjector.Integration.WebApi;

    public class WebApiResolutionContext : IServiceResolver, IDependencyResolver
    {
        private IDependencyResolver _resolver = null;
        private IDependencyScope _scope = null;
        

        #region Init
        private WebApiResolutionContext(IDependencyScope scope)
        {
            this._scope = scope;
        }

        public WebApiResolutionContext(Action<Container> serviceRegistration) : this(null, serviceRegistration)
        { }

        public WebApiResolutionContext(ScopedLifestyle defaultScope, Action<Container> serviceRegistration)
        {
            ThrowNullArguments(() => serviceRegistration);

            var container = new SimpleInjector.Container();
            if (defaultScope != null) container.Options.DefaultScopedLifestyle = defaultScope;

            serviceRegistration.Invoke(container);
            this._resolver = new SimpleInjectorWebApiDependencyResolver(container);
            _scope = _resolver;
        }

        #endregion


        #region ISericeResolver Members
        public void Dispose()
        {
            Eval(() => _resolver?.Dispose());
            Eval(() => _scope?.Dispose());
        }


        public IServiceResolver ManagedScope() => new WebApiResolutionContext(_resolver.As<IDependencyResolver>().BeginScope());

        public IServiceResolver ManagedScope(object parameter) => ManagedScope();


        public object Resolve(Type serviceType, params object[] args) => _scope.GetService(serviceType);

        public Service Resolve<Service>(params object[] args) =>_scope.GetService(typeof(Service)).As<Service>();


        public IEnumerable<object> ResolveAll(Type serviceType, params object[] args) => _scope.GetServices(serviceType);

        public IEnumerable<Service> ResolveAll<Service>(params object[] args) => _scope.GetServices(typeof(Service)).Cast<Service>();
        #endregion


        #region IDependencyResolver Members
        public IDependencyScope BeginScope() => ManagedScope().As<IDependencyScope>();

        public object GetService(Type serviceType) => Resolve(serviceType);

        public IEnumerable<object> GetServices(Type serviceType) => ResolveAll(serviceType);
        #endregion
    }
}