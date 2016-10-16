var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var Shared;
        (function (Shared) {
            var NavbarViewModel = (function () {
                function NavbarViewModel(transport) {
                    this.transport = transport;
                }
                NavbarViewModel.prototype.logout = function () {
                    this.transport.put('/auth/logout', null)
                        .then(function (oprc) {
                        window.localStorage.removeItem(Gaia.Utils.OAuthTokenKey);
                        window.location.href = '/view-server/login/shell';
                    });
                };
                NavbarViewModel.$inject = ['#gaia.utils.domainTransport'];
                return NavbarViewModel;
            }());
            Shared.NavbarViewModel = NavbarViewModel;
        })(Shared = ViewModels.Shared || (ViewModels.Shared = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
