
module Gaia.Utils.Services {

    export class DomainTransport {

        http: angular.IHttpService = null;

        constructor(private $http: angular.IHttpService) {
            var oauthtoken = window.localStorage.getItem(Gaia.Utils.OAuthTokenKey);
            this.$http.defaults.headers.common.Authorization = 'Bearer ' + (oauthtoken ? JSON.parse(oauthtoken).access_token : '');
            this.http = $http;
        }

        private accessDenied(callbackParam: any): boolean {
            if ((callbackParam.Message as string).startsWith('Access Denied')) return true;
            else return false;
        }
        
        get<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {    
            if (data) {
                config = config || {};
                config.data = data;
            }         
            return this.http.get<T>(url, config)
                .error(r => {
                    if (this.accessDenied(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        delete<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            if (data) {
                config = config || {};
                config.data = data;
            }         
            return this.http.delete(url, config)
                .error(r => {
                    if (this.accessDenied(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        head<T>(url: string, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.head(url, config)
                .error(r => {
                    if (this.accessDenied(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        jsonp<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            if (data) {
                config = config || {};
                config.data = data;
            }         
            return this.http.jsonp(url, config)
                .error(r => {
                    if (this.accessDenied(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        post<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.post(url, data, config)
                .error(r => {
                    if (this.accessDenied(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        put<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.put(url, data, config)
                .error(r => {
                    if (this.accessDenied(r)) window.location.href = '/view-server/login/shell';
                });
        }
        
        patch<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.patch(url, data, config)
                .error(r => {
                    if (this.accessDenied(r)) window.location.href = '/view-server/login/shell';
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


    export class NotifyService {

        constructor() {
            toastr.options['closeButton'] = true;
        }

        success(message: string, title?: string) {
            console.log(message);
            toastr.success(this.parse(message), title);
        }
        error(message: string, title?: string) {            
            console.error(message);
            toastr.error(this.parse(message), title);
        }
        info(message: string, title?: string) {
            console.info(message);
            toastr.info(this.parse(message), title);
        }
        warning(message: string, title?: string) {
            console.warn(message);
            toastr.warning(this.parse(message), title);
        }
        option(setting: string, value: any) {
            toastr.options[setting] = value;
        }

        parse(message: string) {
            if (!message || message.length <= 0) return " &nbsp; ";
            else return message;
        }
    }

}