
module Gaia.ViewModels.Login {


    export class Signin {

        password: string;
        email: string;
        signinErrorMessage: string = null;


        hasNoErrors(): boolean {
            return this.signinErrorMessage == null;
        }

        signin() {
            this.transport.post('/Tokens', { grant_type: 'password', user_name: this.email, password: this.password }, {
                headers: {
                    Accept: 'application/json',
                    ContentType: 'application/x-www-form-urlencoded'
                }
            })
            .success(s => {//success
                localStorage.setItem(Gaia.Utils.OAuthTokenKey, '');
                this.$location.url('secured/dashboard-shell');
            })
            .error(e => {//error
                this.signinErrorMessage = "Seems there's a problem with your User-Name or Password...";
            });
        }


        static $inject = ['$location', 'DomainTransport'];
        constructor(private $location: angular.ILocationService, private transport: Gaia.Utils.Services.DomainTransport) {
        }
    }
    Gaia.Utils.moduleConfig.withController('SigninViewModel', Signin);


    export class Signup {

        email: string;
        password: string;
        verifyPassword: string;

        errorMessage: string = null;
        successMessage: string = null;
        messageHeader: string = null;

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
            .success(s => {//success
                //this.setMessage('Splendid!', '', false);
                this.$state.go('message', {
                    back: 'signin',
                    message: '<h2>Splendid!</h2><span>An email has been sent to <strong class="text-primary">' + this.email + '</strong>.<br/>Follow the link in the email to complete your registration.<br/>Cheers'
                });
            })
            .error(e => {//error
                this.setMessage('Oops!', e.Message, true);
                this.password = this.verifyPassword = null;
            });
        }


        static $inject = ['$state', 'DomainTransport'];
        constructor(private $state: angular.ui.IStateService, private transport: Gaia.Utils.Services.DomainTransport) {
        }
    }
    Gaia.Utils.moduleConfig.withController('SignupViewModel', Signup);


    export class RecoveryRequest {

        constructor() {
        }
    }
    Gaia.Utils.moduleConfig.withController('RecoveryRequestViewModel', RecoveryRequest);


    export class RecoverPassword {

        constructor() {
        }
    }
    Gaia.Utils.moduleConfig.withController('RecoverPasswordViewModel', RecoverPassword);


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
    Gaia.Utils.moduleConfig.withController('MessageViewModel', MessageViewModel);


    export class VerifyRegistration {

        hasVerificationError: boolean = false;
        message: string;

        static $inject = ['$state', '$stateParams', 'DomainTransport'];
        constructor(private $state: angular.ui.IStateService, private $stateParams: angular.ui.IStateParamsService, transport: Gaia.Utils.Services.DomainTransport) {
            transport.put('/api/profiles/verification', {
                User: $stateParams['user'],
                Value: $stateParams['verificationToken']
            }, {
                    headers: { Accept: 'application/json' }
                })
                .success(s => {
                    $state.go('signin');
                })
                .error(e => {
                    this.message = e.Message;
                    this.hasVerificationError = true;
                });
        }
    }
    Gaia.Utils.moduleConfig.withController('VerifyRegistrationViewModel', VerifyRegistration);

}