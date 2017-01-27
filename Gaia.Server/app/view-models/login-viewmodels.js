var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Login;
        (function (Login) {
            var Signin = (function () {
                function Signin($window, transport, $q) {
                    this.$window = $window;
                    this.transport = transport;
                    this.$q = $q;
                    this.signinErrorMessage = null;
                    this.isBusy = false;
                }
                Signin.prototype.hasNoErrors = function () {
                    return this.signinErrorMessage == null;
                };
                Signin.prototype.signin = function () {
                    var _this = this;
                    if (this.isBusy)
                        return;
                    //else
                    this.isBusy = true;
                    this.transport
                        .post('/auth/login', { username: this.email, password: this.password, __RequestVerificationToken: angular.element('#antiForgery > input').val() }, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        }
                    })
                        .then(function (s) {
                        _this.isBusy = false;
                        localStorage.setItem(Gaia.Utils.OAuthTokenKey, s.data.Result);
                        _this.$window.location.href = '/view-server/secured/dashboard/shell';
                    }, function (e) {
                        _this.isBusy = false;
                        _this.signinErrorMessage = "There seems to be a problem: " + e.Message + "...";
                        return _this.$q.reject();
                    });
                };
                return Signin;
            }());
            Signin.$inject = ['$window', '#gaia.utils.domainTransport', '$q'];
            Login.Signin = Signin;
            var Signup = (function () {
                function Signup($state, transport) {
                    this.$state = $state;
                    this.transport = transport;
                    this.errorMessage = null;
                    this.successMessage = null;
                    this.messageHeader = null;
                    this.isBusy = false;
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
                    if (this.isBusy)
                        return;
                    if (this.email == null) {
                        this.setMessage('Oops!', "Something's wrong with your emal-address", true);
                        return;
                    }
                    else if (!this.password || !this.verifyPassword || this.password != this.verifyPassword) {
                        this.setMessage('Oops!', 'Your Passwords do not match.', true);
                        return;
                    }
                    this.isBusy = true;
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
                        .then(function (s) {
                        _this.isBusy = false;
                        _this.$state.go('message', {
                            back: 'signin',
                            message: '<h2>Splendid!</h2><span>An email has been sent to <strong class="text-primary">' + _this.email + '</strong>.<br/>Follow the link in the email to complete your registration.<br/>Cheers'
                        });
                    }, function (e) {
                        _this.isBusy = false;
                        _this.setMessage('Oops!', e.data.Message, true);
                        _this.password = _this.verifyPassword = null;
                    });
                };
                return Signup;
            }());
            Signup.$inject = ['$state', '#gaia.utils.domainTransport'];
            Login.Signup = Signup;
            var RecoveryRequest = (function () {
                function RecoveryRequest() {
                }
                return RecoveryRequest;
            }());
            Login.RecoveryRequest = RecoveryRequest;
            var RecoverPassword = (function () {
                function RecoverPassword() {
                }
                return RecoverPassword;
            }());
            Login.RecoverPassword = RecoverPassword;
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
                return MessageViewModel;
            }());
            MessageViewModel.$inject = ['$state', '$stateParams'];
            Login.MessageViewModel = MessageViewModel;
            var VerifyRegistration = (function () {
                function VerifyRegistration($state, $stateParams, $location, transport) {
                    var _this = this;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.$location = $location;
                    this.transport = transport;
                    this.hasVerificationError = false;
                    transport.put('/api/profiles/verification', {
                        User: $stateParams['user'],
                        Value: $stateParams['verificationToken']
                    }, {
                        headers: { Accept: 'application/json' }
                    })
                        .success(function (s) {
                        _this.messageHeader = 'Congratulations!';
                        _this.message = 'Your Account has been Verified. You may now follow the link below to login.';
                        _this.hasVerificationError = false;
                        _this.linkText = 'Signin';
                    })
                        .error(function (e) {
                        _this.messageHeader = 'Oops!';
                        _this.message = e.Message;
                        _this.hasVerificationError = true;
                        _this.linkText = 'Home';
                    });
                }
                VerifyRegistration.prototype.action = function () {
                    if (this.hasVerificationError)
                        this.$location.url('/home');
                    else
                        this.$state.go('signin');
                };
                VerifyRegistration.prototype.hasMessage = function () {
                    return this.message != null || this.messageHeader != null;
                };
                return VerifyRegistration;
            }());
            VerifyRegistration.$inject = ['$state', '$stateParams', '$location', '#gaia.utils.domainTransport'];
            Login.VerifyRegistration = VerifyRegistration;
        })(Login = ViewModels.Login || (ViewModels.Login = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
