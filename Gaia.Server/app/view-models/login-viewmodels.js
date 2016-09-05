var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Login;
        (function (Login) {
            var Signin = (function () {
                function Signin(transport) {
                    this.transport = transport;
                }
                Signin.$inject = ['DomainTransport'];
                return Signin;
            }());
            Login.Signin = Signin;
            Gaia.Utils.moduleConfig.withController('SigninViewModel', Signin);
            var Signup = (function () {
                function Signup() {
                }
                return Signup;
            }());
            Login.Signup = Signup;
            Gaia.Utils.moduleConfig.withController('SignupViewModel', Signup);
            var RecoveryRequest = (function () {
                function RecoveryRequest() {
                }
                return RecoveryRequest;
            }());
            Login.RecoveryRequest = RecoveryRequest;
            Gaia.Utils.moduleConfig.withController('RecoveryRequestViewModel', RecoveryRequest);
            var RecoverPassword = (function () {
                function RecoverPassword() {
                }
                return RecoverPassword;
            }());
            Login.RecoverPassword = RecoverPassword;
            Gaia.Utils.moduleConfig.withController('RecoverPasswordViewModel', RecoverPassword);
        })(Login = ViewModels.Login || (ViewModels.Login = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
