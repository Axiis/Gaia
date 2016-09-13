
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
            .then(s => {//success
                //redirect to the dashboard app
            }, e => {//error
                //report the error
                this.signinErrorMessage = "Seems there's a problem with your User-Name or Password...";
            });
        }


        static $inject = ['DomainTransport'];
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {
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
                //'Credentials': [{
                //    'Value': this.password,
                //    'Metadata': {
                //        'Name': 'Password',
                //        'Access': 1
                //    }
                //}]
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
            .success(s => {//success
                    this.setMessage('Splendid!', 'An email has been sent to <strong>' + this.email + '</strong>.<br/>Follow the link in the email to complete your registration.<br/>Cheers', false);
            })
            .error(e => {//error
                //report the error
                this.setMessage('Oops!', 'Error message here', true);
            });
        }


        static $inject = ['DomainTransport'];
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {
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
}