var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Login;
        (function (Login) {
            var Signin = (function () {
                function Signin(transport) {
                    this.transport = transport;
                    this.signinErrorMessage = null;
                }
                Signin.prototype.hasNoErrors = function () {
                    return this.signinErrorMessage == null;
                };
                Signin.prototype.signin = function () {
                    var _this = this;
                    this.transport.post('/Tokens', { grant_type: 'password', user_name: this.email, password: this.password }, {
                        headers: {
                            Accept: 'application/json',
                            ContentType: 'application/x-www-form-urlencoded'
                        }
                    })
                        .then(function (s) {
                        //redirect to the dashboard app
                    }, function (e) {
                        //report the error
                        _this.signinErrorMessage = "Seems there's a problem with your User-Name or Password...";
                    });
                };
                Signin.$inject = ['DomainTransport'];
                return Signin;
            }());
            Login.Signin = Signin;
            Gaia.Utils.moduleConfig.withController('SigninViewModel', Signin);
            var Signup = (function () {
                function Signup(transport) {
                    this.transport = transport;
                    this.errorMessage = null;
                    this.successMessage = null;
                    this.messageHeader = null;
                }
                Signup.prototype.setMessage = function (header, message, isError) {
                    this.successMessage = this.errorMessage = null;
                    this.messageHeader = header;
                    if (isError)
                        this.errorMessage = message;
                    else
                        this.successMessage = message;
                };
                Signup.prototype.message = function () {
                    if (this.hasErrorMessage())
                        return this.errorMessage;
                    else if (this.hasSuccessMessage())
                        return this.successMessage;
                    else
                        return null;
                };
                Signup.prototype.clearMessage = function () {
                    this.successMessage = this.errorMessage = this.messageHeader = null;
                };
                Signup.prototype.hasMessage = function () {
                    return this.messageHeader != null;
                };
                Signup.prototype.hasErrorMessage = function () {
                    return this.errorMessage != null;
                };
                Signup.prototype.hasSuccessMessage = function () {
                    return this.successMessage != null;
                };
                Signup.prototype.signup = function () {
                    var _this = this;
                    if (this.email == null) {
                        this.setMessage('Oops!', "Something's wrong with your emal-address", true);
                        return;
                    }
                    else if (!this.password || !this.verifyPassword || this.password != this.verifyPassword) {
                        this.setMessage('Oops!', 'Your Passwords do not match.', true);
                        return;
                    }
                    this.transport.post('/api/profiles', {
                        'TargetUser': this.email,
                    }, {
                        headers: {
                            Accept: 'application/json'
                        }
                    })
                        .success(function (s) {
                        _this.setMessage('Splendid!', 'An email has been sent to <strong>' + _this.email + '</strong>.<br/>Follow the link in the email to complete your registration.<br/>Cheers', false);
                    })
                        .error(function (e) {
                        //report the error
                        _this.setMessage('Oops!', 'Error message here', true);
                    });
                };
                Signup.$inject = ['DomainTransport'];
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
//# sourceMappingURL=login-viewmodels.js.map