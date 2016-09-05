
module Gaia.ViewModels.Login {


    export class Signin {

        static $inject = ['DomainTransport'];
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {

        }
    }
    Gaia.Utils.moduleConfig.withController('SigninViewModel', Signin);


    export class Signup {

        constructor() {
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