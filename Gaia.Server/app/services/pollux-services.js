var Pollux;
(function (Pollux) {
    var Services;
    (function (Services) {
        var Authentication = (function () {
            function Authentication($http) {
                this.$http = $http;
            }
            Authentication.$inject = ["$http"];
            return Authentication;
        }());
        Services.Authentication = Authentication;
    })(Services = Pollux.Services || (Pollux.Services = {}));
})(Pollux || (Pollux = {}));
