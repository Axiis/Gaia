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


    public class ResolutionContext : IServiceResolver, IDependencyResolver
    {
        private ResolutionContext _parent = null;
        private Container _simpleInjector = new Container();

        private bool _isSubContext => _parent != null;

        #region Init

        private ResolutionContext(ResolutionContext parent)
        {
            ThrowNullArguments(() => parent);

            this._parent = parent;
        }

        public ResolutionContext(Action<Container> serviceRegistration)
        {
            ThrowNullArguments(() => serviceRegistration);

            serviceRegistration.Invoke(_simpleInjector);
        }

        #endregion


        #region ISericeResolver Members
        public void Dispose()
        {
            if (this._parent != null) this._parent = null;
            else _simpleInjector.Dispose();
        }


        public IServiceResolver ManagedScope() => new ResolutionContext(this);

        public IServiceResolver ManagedScope(object parameter) => ManagedScope();


        public object Resolve(Type serviceType, params object[] args) => _simpleInjector.GetInstance(serviceType);

        public Service Resolve<Service>(params object[] args) => _simpleInjector.GetInstance(typeof(Service)).As<Service>();


        public IEnumerable<object> ResolveAll(Type serviceType, params object[] args) => _simpleInjector.GetAllInstances(serviceType);

        public IEnumerable<Service> ResolveAll<Service>(params object[] args) => _simpleInjector.GetAllInstances(typeof(Service)).Cast<Service>();
        #endregion


        #region IDependencyResolver Members
        public IDependencyScope BeginScope() => ManagedScope().As<IDependencyScope>();

        public object GetService(Type serviceType) => Resolve(serviceType);

        public IEnumerable<object> GetServices(Type serviceType) => ResolveAll(serviceType);
        #endregion
    }
}