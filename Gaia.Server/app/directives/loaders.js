var Gaia;
(function (Gaia) {
    var Directives;
    (function (Directives) {
        var RingLoader = (function () {
            function RingLoader() {
                this.restrict = 'E';
                this.scope = {
                    size: '=?',
                    color: '=?',
                    isBlockLoader: '=?blockLoader',
                    overlayOpacity: '=?',
                    show: '=?'
                };
                this.template = '<div class="inline-center-pseudo" ng-style="overlayStyle()" ng-show="show">' +
                    '<div class="ring-loader" ng-style="containerStyle()">' +
                    '<div ng-style="rotorStyle()"></div>' +
                    '</div>' +
                    '</div>';
            }
            RingLoader.prototype.controller = function ($scope) {
                //default values
                if (!$scope.size)
                    $scope.size = '0px';
                if (!$scope.color)
                    $scope.color = 'rgba(0,0,0,0)';
                if (Object.isNullOrUndefined($scope.isBlockLoader))
                    $scope.isBlockLoader = false;
                if (!$scope.overlayOpacity)
                    $scope.overlayOpacity = 0;
                if (!$scope.show)
                    $scope.show = false;
                $scope.containerStyle = function () {
                    return {
                        height: $scope.size + 'px',
                        width: $scope.size + 'px'
                    };
                };
                $scope.rotorStyle = function () {
                    return {
                        'box-shadow': '0 2px 0 0 ' + $scope.color
                    };
                };
                $scope.overlayStyle = function () {
                    return {
                        'background-color': 'rgba(0,0,0,' + ($scope.overlayOpacity) + ')',
                        display: !$scope.isBlockLoader ? 'inline-block' : 'block',
                        width: !$scope.isBlockLoader ? 'initial' : '100%',
                        height: !$scope.isBlockLoader ? 'initial' : '100%',
                        'text-align': !$scope.isBlockLoader ? 'initial' : 'center'
                    };
                };
            };
            ;
            return RingLoader;
        }());
        Directives.RingLoader = RingLoader;
        var BoxLoader = (function () {
            function BoxLoader() {
                this.restrict = 'E';
                this.scope = {
                    size: '=?',
                    color: '=?',
                    isBlockLoader: '=?blockLoader',
                    overlayOpacity: '=?',
                    show: '=?'
                };
                this.template = '<div class="inline-center-pseudo" ng-style="overlayStyle()" ng-show="show">' +
                    '<div class="cube-loader" ng-style="containerStyle()">' +
                    '<div ng-style="boxStyle()"></div>' +
                    '<div ng-style="boxStyle()"></div>' +
                    '<div ng-style="boxStyle()"></div>' +
                    '<div ng-style="boxStyle()"></div>' +
                    '</div>' +
                    '</div>';
            }
            BoxLoader.prototype.controller = function ($scope) {
                //default values
                if (!$scope.size)
                    $scope.size = '0px';
                if (!$scope.color)
                    $scope.color = 'rgba(0,0,0,0)';
                if (Object.isNullOrUndefined($scope.isBlockLoader))
                    $scope.isBlockLoader = false;
                if (!$scope.overlayOpacity)
                    $scope.overlayOpacity = 0;
                if (!$scope.show)
                    $scope.show = false;
                $scope.containerStyle = function () {
                    return {
                        height: $scope.size + 'px',
                        width: $scope.size + 'px'
                    };
                };
                $scope.boxStyle = function () {
                    return {
                        'background': $scope.color
                    };
                };
                $scope.overlayStyle = function () {
                    return {
                        'background-color': 'rgba(0,0,0,' + ($scope.overlayOpacity) + ')',
                        display: !$scope.isBlockLoader ? 'inline-block' : 'block',
                        width: !$scope.isBlockLoader ? 'initial' : '100%',
                        height: !$scope.isBlockLoader ? 'initial' : '100%',
                        'text-align': !$scope.isBlockLoader ? 'initial' : 'center'
                    };
                };
            };
            ;
            return BoxLoader;
        }());
        Directives.BoxLoader = BoxLoader;
    })(Directives = Gaia.Directives || (Gaia.Directives = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=loaders.js.map