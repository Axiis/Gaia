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
    })(Utils = Gaia.Utils || (Gaia.Utils = {}));
})(Gaia || (Gaia = {}));
