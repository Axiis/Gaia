var Gaia;
(function (Gaia) {
    var Root;
    (function (Root) {
        //module for large/mid screen devices
        Root.gaia = angular.module("gaia", ['ui.router']);
        //module for tiny screen devices (moblie)
        Root.gaiaMobile = angular.module("gaia-mobile", ['ui.router']);
    })(Root = Gaia.Root || (Gaia.Root = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=root.js.map