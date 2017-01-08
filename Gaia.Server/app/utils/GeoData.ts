

module Gaia.Utils {


    export enum Arc {
        Degrees,
        Radians
    }

    export class GeoLocation
    {
        Latitude: number = 0;
        Longitude: number = 0;
        Altitude: number = 0;

        private _arc: Arc;
        get Arc(): Arc {
            return this._arc;
        }
        set Arc(value: Arc) {
            if (value) {
                this._arc = value;
                if (this._arc as Arc == Arc.Degrees) {
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
        }


        constructor(data: Object) {
            this.Arc = Arc.Degrees;
            if (data) {
                data.copyTo(this);
            }
        }

        FullLiteral(): string {
            return '[lat: ' + this.Latitude + ', lon: ' + this.Longitude + ', alt: ' + this.Altitude + ', arc: ' + this.Arc + ']';
        }
        CommonLiteral(): string {
            return '[lat: ' + this.Latitude + ', lon:' + this.Longitude + ']';
        }

        Clone(): GeoLocation {
            return new GeoLocation({
                Altitude : this.Altitude,
                Arc : this.Arc,
                Latitude : this.Latitude,
                Longitude : this.Longitude
            });
        }

        toString(): string {
            return this.CommonLiteral();
        }

        equals(obj: any): boolean {
            if (obj) {
                (obj as GeoLocation)
                    .project <GeoLocation, boolean>(_obj => _obj.Latitude == this.Latitude &&
                        _obj.Longitude == this.Longitude &&
                        _obj.Altitude == this.Altitude &&
                        _obj.Arc == this.Arc);
            }
            else return false;
        }

        Equivalent(location: GeoLocation): boolean {
            if (location) {
                var x = location.Clone();
                x.Arc = this.Arc;
                return this.equals(x);
            }
            else return false;
        }


        static DegreeToRadian(value: number): number {
            return (value * Math.PI) / 180.0;
        }
        static RadianToDegree(value: number): number {
            return (value * 180.0) / Math.PI;
        }
        static Parse(data: string): GeoLocation {
            return data.trimChars(['[', ']'])
                .replace(",", ";")
                .project<string, StringPair[]>(v => StringPair.ParseStringPairs(v))
                .project<StringPair[], GeoLocation>(values => new GeoLocation({
                    Latitude: parseFloat(values.first(v => v.Key.toLowerCase().startsWith("lat")).Value),
                    Longitude: parseFloat(values.first(v => v.Key.toLowerCase().startsWith("lon")).Value),
                    Altitude: parseFloat(values.firstOrDefault(v => v.Key.toLowerCase().startsWith("alt")).Value || "0"),
                    Arc: Arc[values.firstOrDefault(v => v.Key.toLowerCase().startsWith("arc")).Value || "Degrees"],
                }));
        }
    }

    export class GeoArea{

        GeoLocations: GeoLocation[] = [];

        get PointCount() {
            return this.GeoLocations.length;
        }

        constructor(locations?: GeoLocation[]) {

            if (locations) {
                locations.forEach(v => this.GeoLocations.push(v));
            }
        }

        public IsValidGeoArea(): boolean{
            throw 'NotImplementedException';
        }

        static AreaPattern = /\[[^\]+]\](\s*\,\s*\[[^\]+]\])+/;
        static Parse(data: string): GeoArea {
            return GeoArea.AreaPattern.exec(data)
                .map(_match => GeoLocation.Parse(_match))
                .project<GeoLocation[], GeoArea>(_locations => new GeoArea(_locations));
        }
    }
}