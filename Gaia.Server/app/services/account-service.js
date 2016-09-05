"use strict";
var root_1 = require('../root');
var AccountService = (function () {
    function AccountService($http) {
        this.$http = $http;
    }
    AccountService.prototype.registerUser = function () {
        return null;
    };
    AccountService.$inject = ["$http"];
    return AccountService;
}());
exports.AccountService = AccountService;
root_1.default.controller("AccountService", AccountService);
