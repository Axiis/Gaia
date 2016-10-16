
module Gaia.Utils.Services {

    export class DomainTransport {

        http: angular.IHttpService = null;

        constructor(private $http: angular.IHttpService) {
            var oauthtoken = window.localStorage.getItem(Gaia.Utils.OAuthTokenKey);
            this.$http.defaults.headers.common.Authorization = 'Bearer ' + (oauthtoken ? JSON.parse(oauthtoken).access_token : '');
            this.http = $http;
        }

        private tokenExpired(callbackParam: any): boolean {
            throw 'not implemented';
        }
        
        get<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {    
            if (data) {
                config = config || {};
                config.data = data;
            }         
            return this.http.get<T>(url, config)
                .error(r => {
                    if (this.tokenExpired(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        delete<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            if (data) {
                config = config || {};
                config.data = data;
            }         
            return this.http.delete(url, config)
                .error(r => {
                    if (this.tokenExpired(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        head<T>(url: string, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.head(url, config)
                .error(r => {
                    if (this.tokenExpired(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        jsonp<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            if (data) {
                config = config || {};
                config.data = data;
            }         
            return this.http.jsonp(url, config)
                .error(r => {
                    if (this.tokenExpired(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        post<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.post(url, data, config)
                .error(r => {
                    if (this.tokenExpired(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        put<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.put(url, data, config)
                .error(r => {
                    if (this.tokenExpired(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        patch<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.patch(url, data, config)
                .error(r => {
                    if (this.tokenExpired(r)) window.location.href = '/view-server/login/shell';
                });
        }
    }


    export class DomModelService {

        public simpleModel: any = {};
        public complexModel: any = null;

        constructor() {
            var $element = angular.element('#local-models');

            //simple model
            $element.attr('simple-models')
                .project((v: string) => Gaia.Utils.StringPair.ParseStringPairs(v))
                .forEach(v => {
                    this.simpleModel[v.Key] = v.Value;
                });

            //complex model
            try {
                this.complexModel = JSON.parse($element.html());
            }
            catch (e) {
                this.complexModel = {};
            }
        }
    }

}