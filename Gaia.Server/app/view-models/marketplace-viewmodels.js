var Gaia;
(function (Gaia) {
    var ViewModels;
    (function (ViewModels) {
        var MarketPlace;
        (function (MarketPlace) {
            var MarketPlaceViewModel = (function () {
                function MarketPlaceViewModel(contextToolbar, state) {
                    this.contextToolbar = contextToolbar;
                    this.state = state;
                }
                MarketPlaceViewModel.prototype.currentState = function () {
                    return this.state.current.name;
                };
                MarketPlaceViewModel.$inject = ['#gaia.contextToolbar', '$state'];
                return MarketPlaceViewModel;
            }());
            MarketPlace.MarketPlaceViewModel = MarketPlaceViewModel;
            var CustomerViewModel = (function () {
                function CustomerViewModel() {
                }
                return CustomerViewModel;
            }());
            MarketPlace.CustomerViewModel = CustomerViewModel;
            var MerchantViewModel = (function () {
                function MerchantViewModel() {
                }
                return MerchantViewModel;
            }());
            MarketPlace.MerchantViewModel = MerchantViewModel;
            var ConfigureViewModel = (function () {
                function ConfigureViewModel() {
                }
                return ConfigureViewModel;
            }());
            MarketPlace.ConfigureViewModel = ConfigureViewModel;
        })(MarketPlace = ViewModels.MarketPlace || (ViewModels.MarketPlace = {}));
    })(ViewModels = Gaia.ViewModels || (Gaia.ViewModels = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=marketplace-viewmodels.js.map