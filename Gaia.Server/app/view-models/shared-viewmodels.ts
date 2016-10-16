
module Gaia.ViewModels.Shared {

    export class NavbarViewModel {


        logout() {
            this.transport.put('/auth/logout', null)
                .then(oprc => {
                    window.localStorage.removeItem(Gaia.Utils.OAuthTokenKey);
                    window.location.href = '/view-server/login/shell';
                });
        }


        static $inject = ['#gaia.utils.domainTransport']
        constructor(private transport: Gaia.Utils.Services.DomainTransport) {
            
        }
    }

}