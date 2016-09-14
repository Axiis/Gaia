var Gaia;
(function (Gaia) {
    var Utils;
    (function (Utils) {
        var Services;
        (function (Services) {
            var DomainTransport = (function () {
                function DomainTransport($http) {
                    this.$http = $http;
                    this.http = null;
                    this.http = $http;
                }
                DomainTransport.prototype.get = function (url, config) {
                    return this.http.get(url, config);
                };
                DomainTransport.prototype.delete = function (url, config) {
                    return this.http.delete(url, config);
                };
                DomainTransport.prototype.head = function (url, config) {
                    return this.http.head(url, config);
                };
                DomainTransport.prototype.jsonp = function (url, config) {
                    return this.http.jsonp(url, config);
                };
                DomainTransport.prototype.post = function (url, data, config) {
                    return this.http.post(url, data, config);
                };
                DomainTransport.prototype.put = function (url, data, config) {
                    return this.http.put(url, data, config);
                };
                DomainTransport.prototype.patch = function (url, data, config) {
                    return this.http.patch(url, data, config);
                };
                return DomainTransport;
            }());
            Services.DomainTransport = DomainTransport;
            Gaia.Utils.moduleConfig.withService('DomainTransport', DomainTransport);
        })(Services = Utils.Services || (Utils.Services = {}));
    })(Utils = Gaia.Utils || (Gaia.Utils = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=utility-services.js.map