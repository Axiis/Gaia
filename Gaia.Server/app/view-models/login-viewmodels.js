var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Login;
        (function (Login) {
            var Signin = (function () {
                function Signin($location, transport) {
                    this.$location = $location;
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
                        .success(function (s) {
                        localStorage.setItem(Gaia.Utils.OAuthTokenKey, '');
                        _this.$location.url('secured/dashboard-shell');
                    })
                        .error(function (e) {
                        _this.signinErrorMessage = "Seems there's a problem with your User-Name or Password...";
                    });
                };
                Signin.$inject = ['$location', 'DomainTransport'];
                return Signin;
            }());
            Login.Signin = Signin;
            Gaia.Utils.moduleConfig.withController('SigninViewModel', Signin);
            var Signup = (function () {
                function Signup($state, transport) {
                    this.$state = $state;
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
                        'Credentials': [{
                                'Value': this.password,
                                'Metadata': {
                                    'Name': 'Password',
                                    'Access': 1
                                }
                            }]
                    }, {
                        headers: {
                            Accept: 'application/json'
                        }
                    })
                        .success(function (s) {
                        //this.setMessage('Splendid!', '', false);
                        _this.$state.go('message', {
                            back: 'signin',
                            message: '<h2>Splendid!</h2><span>An email has been sent to <strong class="text-primary">' + _this.email + '</strong>.<br/>Follow the link in the email to complete your registration.<br/>Cheers'
                        });
                    })
                        .error(function (e) {
                        _this.setMessage('Oops!', e.Message, true);
                        _this.password = _this.verifyPassword = null;
                    });
                };
                Signup.$inject = ['$state', 'DomainTransport'];
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
            var MessageViewModel = (function () {
                function MessageViewModel($state, $stateParams) {
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                }
                MessageViewModel.prototype.ok = function () {
                    this.$state.go(this.$stateParams['back'] || 'signin');
                };
                MessageViewModel.prototype.message = function () {
                    return this.$stateParams['message'];
                };
                MessageViewModel.$inject = ['$state', '$stateParams'];
                return MessageViewModel;
            }());
            Login.MessageViewModel = MessageViewModel;
            Gaia.Utils.moduleConfig.withController('MessageViewModel', MessageViewModel);
            var VerifyRegistration = (function () {
                function VerifyRegistration($state, $stateParams, transport) {
                    var _this = this;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.hasVerificationError = false;
                    transport.put('/api/profiles/verification', {
                        User: $stateParams['user'],
                        Value: $stateParams['verificationToken']
                    }, {
                        headers: { Accept: 'application/json' }
                    })
                        .success(function (s) {
                        $state.go('signin');
                    })
                        .error(function (e) {
                        _this.message = e.Message;
                        _this.hasVerificationError = true;
                    });
                }
                VerifyRegistration.$inject = ['$state', '$stateParams', 'DomainTransport'];
                return VerifyRegistration;
            }());
            Login.VerifyRegistration = VerifyRegistration;
            Gaia.Utils.moduleConfig.withController('VerifyRegistrationViewModel', VerifyRegistration);
        })(Login = ViewModels.Login || (ViewModels.Login = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=login-viewmodels.js.map