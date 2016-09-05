
module Gaia.Utils.Services {

    export class DomainTransport {

        http: angular.IHttpService = null;

        constructor(private $http: angular.IHttpService) {
            this.http = $http;
        }
        
        get<T>(url: string, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.get(url, config);
        }
        
        delete<T>(url: string, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.delete(url, config);
        }
        
        head<T>(url: string, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.head(url, config);
        }
        
        jsonp<T>(url: string, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.jsonp(url, config);
        }
        
        post<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.post(url, config);
        }
        
        put<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.put(url, config);
        }
        
        patch<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.patch(url, config);
        }
    }
    Gaia.Utils.moduleConfig.withService('DomainTransport', DomainTransport);

}