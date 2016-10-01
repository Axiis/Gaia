
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
            return this.http.jsonp(url, config);
        }
        
        post<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.post(url, data, config);
        }
        
        put<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.put(url, data, config);
        }
        
        patch<T>(url: string, data: any, config?: angular.IRequestShortcutConfig): angular.IHttpPromise<T> {
            return this.http.patch(url, data, config);
        }
    }


    export class DomModelService {

        public model: any = {};

        constructor() {
            angular.element('#cbt-model')
                .attr('simpleProperties')
                .project((v: string) => Gaia.Utils.ParseStringPairs(v))
                .forEach(v => {
                    this.model[v.Key] = v.Value;
                });
        }
    }

}