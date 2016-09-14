var Gaia;
(function (Gaia) {
    var Utils;
    (function (Utils) {
        var lut = [];
        for (var i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }
        function NewGuid() {
            var d0 = Math.random() * 0xffffffff | 0;
            var d1 = Math.random() * 0xffffffff | 0;
            var d2 = Math.random() * 0xffffffff | 0;
            var d3 = Math.random() * 0xffffffff | 0;
            return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
        }
        Utils.NewGuid = NewGuid;
        //Class that implements pagination
        var SequencePage = (function () {
            function SequencePage(page, pageIndex, pageSize, sequenceLength) {
                this.Page = [];
                if (page == null || pageIndex < 0 || sequenceLength < 0)
                    throw "invalid page";
                this.PageIndex = pageIndex;
                this.SequenceLength = sequenceLength;
                this.Page = page;
                this.PageSize = pageSize;
                this.PageCount = this.SequenceLength / this.PageSize + (this.SequenceLength % this.PageSize > 0 ? 1 : 0);
            }
            /// <summary>
            /// Returns an array containing page indexes for pages immediately adjecent to the current page.
            /// The span indicates how many pages indexes to each side of the current page should be returned
            /// </summary>
            /// <param name="span"></param>
            /// <returns></returns>
            SequencePage.prototype.AdjacentIndexes = function (span) {
                if (span < 0)
                    throw 'invalid span: ' + span;
                var fullspan = (span * 2) + 1, start = 0, count = 0;
                if (fullspan >= this.PageCount)
                    count = this.PageCount;
                else {
                    start = this.PageIndex - span;
                    count = fullspan;
                    if (start < 0)
                        start = 0;
                    if ((this.PageIndex + span) >= this.PageCount)
                        start = this.PageCount - fullspan;
                }
                var pages = [];
                for (var indx = 0; indx < count; indx++)
                    pages.push(indx + start);
                return pages;
            };
            return SequencePage;
        }());
        Utils.SequencePage = SequencePage;
        //Used to configure the registered angular modules with services and controllers
        var ModuleConfigurer = (function () {
            function ModuleConfigurer() {
                this._modules = [];
            }
            ModuleConfigurer.prototype.addModule = function (module) {
                if (!module)
                    throw 'invalid module';
                //else
                this._modules.push(module);
                return this;
            };
            ModuleConfigurer.prototype.withService = function (name, service) {
                if (!service)
                    throw 'invalid service';
                //else
                this._modules.forEach(function (_m) { return _m.service(name, service); });
                return this;
            };
            ModuleConfigurer.prototype.withController = function (name, controller) {
                if (!controller)
                    throw 'invalid controller';
                //else
                this._modules.forEach(function (_m) { return _m.controller(name, controller); });
                return this;
            };
            return ModuleConfigurer;
        }());
        Utils.moduleConfig = new ModuleConfigurer();
        //Operation class
        var Operation = (function () {
            function Operation() {
            }
            Operation.prototype.Resolve = function () {
                if (!this.Succeeded && this.Message)
                    throw this.Message;
                else
                    return this.Result;
            };
            return Operation;
        }());
        Utils.Operation = Operation;
        //constant for fetching authorization from local browser keystore
        Utils.OAuthTokenKey = 'Gaia.Security.OAuth.AuthorizationToken#KEY';
    })(Utils = Gaia.Utils || (Gaia.Utils = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=tools.js.map