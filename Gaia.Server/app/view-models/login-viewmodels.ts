
module Gaia.ViewModels.Login {


    export class Signin {

        password: string;
        email: string;
        signinErrorMessage: string = null;
        isBusy: boolean = false;


        hasNoErrors(): boolean {
            return this.signinErrorMessage == null;
        }

        signin() {

            if (this.isBusy) return;
            //else
            this.isBusy = true;

            this.transport
                .post<Axis.Luna.Domain.Operation<string>>('/auth/login', { username: this.email, password: this.password, __RequestVerificationToken: angular.element('#antiForgery > input').val() }, {
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
                .then(s => {//success
                    this.isBusy = false;
                    localStorage.setItem(Gaia.Utils.OAuthTokenKey, s.data.Result);
                    this.$window.location.href = '/view-server/secured/dashboard/shell';
                }, e => {//error
                    this.isBusy = false;
                    this.signinErrorMessage = "Seems there's a problem with your User-Name or Password...";
                });
        }


        static $inject = ['$window', '#gaia.utils.domainTransport'];
        constructor(private $window: angular.IWindowService, private transport: Gaia.Utils.Services.DomainTransport) {
        }
    }


    export class Signup {

        email: string;
        password: string;
        verifyPassword: string;

        errorMessage: string = null;
        successMessage: string = null;
        messageHeader: string = null;

        isBusy: boolean = false;

        setMessage(header: string, message: string, isError: boolean) {
            this.successMessage = this.errorMessage = null;
            this.messageHeader = header;

            if (isError) this.errorMessage = message;
            else this.successMessage = message;
        }

        message(): string {
            if (this.hasErrorMessage()) return this.errorMessage;
            else if (this.hasSuccessMessage()) return this.successMessage;
            else return null;
        }

        clearMessage() {
            this.successMessage = this.errorMessage = this.messageHeader = null;
        }

        hasMessage(): boolean {
            return this.messageHeader != null;
        }

        hasErrorMessage(): boolean {
            return this.errorMessage != null;
        }

        hasSuccessMessage(): boolean {
            return this.successMessage != null;
        }


        signup() {

            if (this.isBusy) return;

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
            .then(s => {//success
                this.isBusy = false;
                this.$state.go('message', {
                    back: 'signin',
                    message: '<h2>Splendid!</h2><span>An email has been sent to <strong class="text-primary">' + this.email + '</strong>.<br/>Follow the link in the email to complete your registration.<br/>Cheers'
                });
            }, e => {//error
                this.isBusy = false;
                this.setMessage('Oops!', e.data.Message, true);
                this.password = this.verifyPassword = null;
            });
        }


        static $inject = ['$state', '#gaia.utils.domainTransport'];
        constructor(private $state: angular.ui.IStateService, private transport: Gaia.Utils.Services.DomainTransport) {
        }
    }


    export class RecoveryRequest {

        constructor() {
        }
    }


    export class RecoverPassword {

        constructor() {
        }
    }


    export class MessageViewModel {

        static $inject = ['$state', '$stateParams'];
        constructor(private $state: angular.ui.IStateService, private $stateParams: angular.ui.IStateParamsService) {
        }

        ok() {
            this.$state.go(this.$stateParams['back'] || 'signin');
        }

        message(): string {
            return this.$stateParams['message'];
        }
    }


    export class VerifyRegistration {

        hasVerificationError: boolean = false;
        message: string;
        messageHeader: string;
        linkText: string;

        action() {
            if (this.hasVerificationError) this.$location.url('/home');
            else this.$state.go('signin');
        }

        hasMessage(): boolean {
            return this.message != null || this.messageHeader != null;
        }

        static $inject = ['$state', '$stateParams', '$location', '#gaia.utils.domainTransport'];
        constructor(private $state: angular.ui.IStateService, private $stateParams: angular.ui.IStateParamsService,
            private $location: angular.ILocationService, private transport: Gaia.Utils.Services.DomainTransport) {
            transport.put('/api/profiles/verification', {
                User: $stateParams['user'],
                Value: $stateParams['verificationToken']
            }, {
                    headers: { Accept: 'application/json' }
                })
                .success(s => {
                    this.messageHeader = 'Congratulations!';
                    this.message = 'Your Account has been Verified. You may now follow the link below to login.';
                    this.hasVerificationError = false;
                    this.linkText = 'Signin';
                })
                .error(e => {
                    this.messageHeader = 'Oops!';
                    this.message = e.Message;
                    this.hasVerificationError = true;
                    this.linkText = 'Home';
                });
        }
    }

}