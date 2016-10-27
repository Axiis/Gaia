var Gaia;
(function (Gaia) {
    var Utils;
    (function (Utils) {
        (function (Arc) {
            Arc[Arc["Degrees"] = 0] = "Degrees";
            Arc[Arc["Radians"] = 1] = "Radians";
        })(Utils.Arc || (Utils.Arc = {}));
        var Arc = Utils.Arc;
        var GeoLocation = (function () {
            function GeoLocation(data) {
                this.Latitude = 0;
                this.Longitude = 0;
                this.Altitude = 0;
                this.Arc = Arc.Degrees;
                if (data) {
                    data.copyTo(this);
                }
            }
            Object.defineProperty(GeoLocation.prototype, "Arc", {
                get: function () {
                    return this._arc;
                },
                set: function (value) {
                    if (value) {
                        this._arc = value;
                        if (this._arc == Arc.Degrees) {
                            //convert from radians to degree
                            this.Latitude = GeoLocation.RadianToDegree(this.Latitude);
                            this.Longitude = GeoLocation.RadianToDegree(this.Longitude);
                        }
                        else {
                            //convert from degree to radians
                            this.Latitude = GeoLocation.DegreeToRadian(this.Latitude);
                            this.Longitude = GeoLocation.DegreeToRadian(this.Longitude);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            GeoLocation.prototype.FullLiteral = function () {
                return '[lat: ' + this.Latitude + ', lon: ' + this.Longitude + ', alt: ' + this.Altitude + ', arc: ' + this.Arc + ']';
            };
            GeoLocation.prototype.CommonLiteral = function () {
                return '[lat: ' + this.Latitude + ', lon:' + this.Longitude + ']';
            };
            GeoLocation.prototype.Clone = function () {
                return new GeoLocation({
                    Altitude: this.Altitude,
                    Arc: this.Arc,
                    Latitude: this.Latitude,
                    Longitude: this.Longitude
                });
            };
            GeoLocation.prototype.toString = function () {
                return this.CommonLiteral();
            };
            GeoLocation.prototype.equals = function (obj) {
                var _this = this;
                if (obj) {
                    obj
                        .project(function (_obj) { return _obj.Latitude == _this.Latitude &&
                        _obj.Longitude == _this.Longitude &&
                        _obj.Altitude == _this.Altitude &&
                        _obj.Arc == _this.Arc; });
                }
                else
                    return false;
            };
            GeoLocation.prototype.Equivalent = function (location) {
                if (location) {
                    var x = location.Clone();
                    x.Arc = this.Arc;
                    return this.equals(x);
                }
                else
                    return false;
            };
            GeoLocation.DegreeToRadian = function (value) {
                return (value * Math.PI) / 180.0;
            };
            GeoLocation.RadianToDegree = function (value) {
                return (value * 180.0) / Math.PI;
            };
            GeoLocation.Parse = function (data) {
                return data.trimChars(['[', ']'])
                    .replace(",", ";")
                    .project(function (v) { return Utils.StringPair.ParseStringPairs(v); })
                    .project(function (values) { return new GeoLocation({
                    Latitude: parseFloat(values.first(function (v) { return v.Key.toLowerCase().startsWith("lat"); }).Value),
                    Longitude: parseFloat(values.first(function (v) { return v.Key.toLowerCase().startsWith("lon"); }).Value),
                    Altitude: parseFloat(values.firstOrDefault(function (v) { return v.Key.toLowerCase().startsWith("alt"); }).Value || "0"),
                    Arc: Arc[values.firstOrDefault(function (v) { return v.Key.toLowerCase().startsWith("arc"); }).Value || "Degrees"],
                }); });
            };
            return GeoLocation;
        }());
        Utils.GeoLocation = GeoLocation;
        var GeoArea = (function () {
            function GeoArea(locations) {
                var _this = this;
                this.GeoLocations = [];
                if (locations) {
                    locations.forEach(function (v) { return _this.GeoLocations.push(v); });
                }
            }
            Object.defineProperty(GeoArea.prototype, "PointCount", {
                get: function () {
                    return this.GeoLocations.length;
                },
                enumerable: true,
                configurable: true
            });
            GeoArea.prototype.IsValidGeoArea = function () {
                throw 'NotImplementedException';
            };
            GeoArea.Parse = function (data) {
                return GeoArea.AreaPattern.exec(data)
                    .map(function (_match) { return GeoLocation.Parse(_match); })
                    .project(function (_locations) { return new GeoArea(_locations); });
            };
            GeoArea.AreaPattern = /\[[^\]+]\](\s*\,\s*\[[^\]+]\])+/;
            return GeoArea;
        }());
        Utils.GeoArea = GeoArea;
    })(Utils = Gaia.Utils || (Gaia.Utils = {}));
})(Gaia || (Gaia = {}));
//# sourceMappingURL=GeoData.js.map