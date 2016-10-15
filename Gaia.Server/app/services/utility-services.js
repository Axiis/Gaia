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
                    this.$http.defaults.headers.common.Authorization = 'Bearer ' + window.localStorage[Gaia.Utils.OAuthTokenKey];
                    this.http = $http;
                }
                DomainTransport.prototype.tokenExpired = function (callbackParam) {
                    throw 'not implemented';
                };
                DomainTransport.prototype.get = function (url, data, config) {
                    var _this = this;
                    if (data) {
                        config = config || {};
                        config.data = data;
                    }
                    return this.http.get(url, config)
                        .error(function (r) {
                        if (_this.tokenExpired(r))
                            window.location.href = '/view-server/login/shell';
                    });
                };
                DomainTransport.prototype.delete = function (url, data, config) {
                    var _this = this;
                    if (data) {
                        config = config || {};
                        config.data = data;
                    }
                    return this.http.delete(url, config)
                        .error(function (r) {
                        if (_this.tokenExpired(r))
                            window.location.href = '/view-server/login/shell';
                    });
                };
                DomainTransport.prototype.head = function (url, config) {
                    var _this = this;
                    return this.http.head(url, config)
                        .error(function (r) {
                        if (_this.tokenExpired(r))
                            window.location.href = '/view-server/login/shell';
                    });
                };
                DomainTransport.prototype.jsonp = function (url, data, config) {
                    var _this = this;
                    if (data) {
                        config = config || {};
                        config.data = data;
                    }
                    return this.http.jsonp(url, config)
                        .error(function (r) {
                        if (_this.tokenExpired(r))
                            window.location.href = '/view-server/login/shell';
                    });
                };
                DomainTransport.prototype.post = function (url, data, config) {
                    var _this = this;
                    return this.http.post(url, data, config)
                        .error(function (r) {
                        if (_this.tokenExpired(r))
                            window.location.href = '/view-server/login/shell';
                    });
                };
                DomainTransport.prototype.put = function (url, data, config) {
                    var _this = this;
                    return this.http.put(url, data, config)
                        .error(function (r) {
                        if (_this.tokenExpired(r))
                            window.location.href = '/view-server/login/shell';
                    });
                };
                DomainTransport.prototype.patch = function (url, data, config) {
                    var _this = this;
                    return this.http.patch(url, data, config)
                        .error(function (r) {
                        if (_this.tokenExpired(r))
                            window.location.href = '/view-server/login/shell';
                    });
                };
                return DomainTransport;
            }());
            Services.DomainTransport = DomainTransport;
            var DomModelService = (function () {
                function DomModelService() {
                    var _this = this;
                    this.simpleModel = {};
                    this.complexModel = null;
                    var $element = angular.element('#local-model');
                    //simple model
                    $element.attr('simple-models')
                        .project(function (v) { return Gaia.Utils.StringPair.ParseStringPairs(v); })
                        .forEach(function (v) {
                        _this.simpleModel[v.Key] = v.Value;
                    });
                    //complex model
                    try {
                        this.complexModel = JSON.parse($element.html());
                    }
                    catch (e) {
                        this.complexModel = {};
                    }
                }
                return DomModelService;
            }());
            Services.DomModelService = DomModelService;
        })(Services = Utils.Services || (Utils.Services = {}));
    })(Utils = Gaia.Utils || (Gaia.Utils = {}));
})(Gaia || (Gaia = {}));
