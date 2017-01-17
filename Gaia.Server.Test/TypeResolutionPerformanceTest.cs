using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Axis.Luna;
using System.Web.Http.Dependencies;
using System.Web.Http;
using SimpleInjector;

using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;
using System.Collections.Generic;
using SimpleInjector.Extensions.ExecutionContextScoping;
using Gaia.Server.Controllers;

namespace UnitTestProject1
{
    [TestClass]
    public class TypeResolutionPerformanceTest
    {
        [TestMethod]
        public void TestMethod1()
        {
            var resolver = new ThreadScopedResolutionContext(new ExecutionContextScopeLifestyle(), Gaia.Server.DI.DIRegistration.RegisterTypes);

            using (var scope = resolver.BeginScope())
            {
                //first run
                var start = DateTime.Now;
                var profileController = scope.GetService(typeof(MarketPlaceController));
                var end = DateTime.Now;
                Console.WriteLine($"First run: {end - start}");
            }

            using (var scope = resolver.BeginScope())
            {
                //second run
                var start = DateTime.Now;
                var profileController = scope.GetService(typeof(MarketPlaceController));
                var end = DateTime.Now;
                Console.WriteLine($"Second run: {end - start}");
            }

            using (var scope = resolver.BeginScope())
            {
                //third run
                var start = DateTime.Now;
                var profileController = scope.GetService(typeof(MarketPlaceController));
                var end = DateTime.Now;
                Console.WriteLine($"Third run: {end - start}");
            }
        }

        [TestMethod]
        public void LateRegistrationTest()
        {
            var c = new Container();

        }
    }

    public interface ISomething
    {

    }
    public class Something: ISomething
    {

    }
        

    public class CustomWebapiScope: ExecutionContextScopeLifestyle
    {

    }



    public class ThreadScopedResolutionContext : IServiceResolver, IDependencyResolver
    {
        private Container _resolver = null;
        private Scope _scope = null;


        #region Init
        private ThreadScopedResolutionContext(Scope scope)
        {
            this._scope = scope;
        }

        public ThreadScopedResolutionContext(Action<Container> serviceRegistration) : this(null, serviceRegistration)
        { }

        public ThreadScopedResolutionContext(ScopedLifestyle defaultScope, Action<Container> serviceRegistration)
        {
            ThrowNullArguments(() => serviceRegistration);

            var container = new Container();
            if (defaultScope != null) container.Options.DefaultScopedLifestyle = defaultScope;

            serviceRegistration.Invoke(container);
            _resolver = container;
        }

        #endregion


        #region ISericeResolver Members
        public void Dispose()
        {
            Eval(() => _resolver?.Dispose());
            Eval(() => _scope?.Dispose());
        }


        public IServiceResolver ManagedScope() => new ThreadScopedResolutionContext(_resolver.BeginLifetimeScope());

        public IServiceResolver ManagedScope(object parameter) => ManagedScope();


        public object Resolve(Type serviceType, params object[] args)
        {
            if (_scope != null) return _scope.GetInstance(serviceType);
            else return _resolver.GetInstance(serviceType);
        }

        public Service Resolve<Service>(params object[] args)
        {
            if (_scope != null) return (Service)_scope.GetInstance(typeof(Service));
            else return (Service)_resolver.GetInstance(typeof(Service));
        }


        public IEnumerable<object> ResolveAll(Type serviceType, params object[] args)
        {
            return null;
        }

        public IEnumerable<Service> ResolveAll<Service>(params object[] args) => null;
        #endregion


        #region IDependencyResolver Members
        public IDependencyScope BeginScope() => ManagedScope().As<IDependencyScope>();

        public object GetService(Type serviceType) => Resolve(serviceType);

        public IEnumerable<object> GetServices(Type serviceType) => ResolveAll(serviceType);
        #endregion
    }
}
