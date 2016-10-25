using Axis.Luna;
using Axis.Luna.Extensions;
using Axis.Narvi.Extensions;
using Axis.Narvi.Notify;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using static Axis.Luna.Extensions.ObjectExtensions;

namespace Gaia.Core.Utils
{
    public enum Arc
    {
        Degrees,
        Radians
    }

    public class GeoLocation: NotifierBase
    {
        public Arc Arc
        {
            get { return get<Arc>(); }
            set { set(ref value); }
        }

        public double Latitude
        {
            get { return get<double>(); }
            set { set(ref value); }
        }

        public double Longitude
        {
            get { return get<double>(); }
            set { set(ref value); }
        }

        public double Altitude
        {
            get { return get<double>(); }
            set { set(ref value); }
        }


        public GeoLocation()
        {
            this.NotifyFor(nameof(Arc), (sender, arg) =>
            {
                if(Arc == Arc.Degrees)
                {
                    //convert from radians to degree
                    Latitude = RadianToDegree(Latitude);
                    Longitude = RadianToDegree(Longitude);
                }
                else
                {
                    //convert from degree to radians
                    Latitude = DegreeToRadian(Latitude);
                    Longitude = DegreeToRadian(Longitude);
                }
            });
        }

        public string FullLiteral() => $"[lat: {Latitude}, lon: {Longitude}, alt: {Altitude}, arc: {Arc}]";
        public string CommonLiteral() => $"[lat: {Latitude}, lon:{Longitude}]";

        public GeoLocation Clone() => new GeoLocation
        {
            Altitude = Altitude,
            Arc = Arc,
            Latitude = Latitude,
            Longitude = Longitude
        };


        public override string ToString() => CommonLiteral();

        public override bool Equals(object obj)
            => obj.As<GeoLocation>()
                  .Pipe(_obj => _obj?.Latitude == Latitude &&
                                _obj?.Longitude == Longitude &&
                                _obj?.Altitude == Altitude &&
                                _obj?.Arc == Arc);

        public bool Equivalent(GeoLocation location)
            => location?
                .Clone()
                .UsingValue(l => { l.Arc = Arc; })
                .Equals(this) ?? false;


        public override int GetHashCode() => this.PropertyHash();


        static public double DegreeToRadian(double value) => (value * Math.PI) / 180d;
        static public double RadianToDegree(double value) => (value * 180) / Math.PI;

        static public GeoLocation Parse(string data)
            => data.Trim('[', ']')
                   .Replace(",", ";")
                   .Pipe(v => TagBuilder.Parse(v))
                   .Pipe(values => new GeoLocation
                   {
                       Latitude = double.Parse(values.First(v=> v.Name.ToLower().StartsWith("lat")).Value),
                       Longitude = double.Parse(values.First(v => v.Name.ToLower().StartsWith("lon")).Value),
                       Altitude = double.Parse(values.FirstOrDefault(v => v.Name.ToLower().StartsWith("alt"))?.Value ?? "0"),
                       Arc = Enum.Parse(typeof(Arc), values.FirstOrDefault(v => v.Name.ToLower().StartsWith("arc"))?.Value ?? "Degrees").As<Arc>(),
                   });
        static public bool TryParse(string data, out GeoLocation @return)
        {
            @return = null;
            try
            {
                @return = Parse(data);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }

    public class GeoArea: NotifierBase
    {
        public ICollection<GeoLocation> GeoLocations { get; private set; } = new ObservableCollection<GeoLocation>();

        public long PointCount => GeoLocations.Count;

        public GeoArea() : this(null)
        { }
        public GeoArea(IEnumerable<GeoLocation> locations)
        {
            GeoLocations.AddRange(locations ?? new GeoLocation[0]);

            GeoLocations.As<ObservableCollection<GeoLocation>>().CollectionChanged += (x, y) =>
            {
                notify(nameof(PointCount));
            };
        }

        public bool IsValidGeoArea()
        {
            throw new NotImplementedException();
        }

        static private Regex GeoAreaPattern = new Regex(@"\[[^\]+]\](\s*\,\s*\[[^\]+]\])+");
        static public GeoArea Parse(string data)
            => GeoAreaPattern.Matches(data)
                .Cast<Match>()
                .Select(_match => GeoLocation.Parse(_match.Value))
                .Pipe(_locations => new GeoArea(_locations));

        static public bool TryParse(string data, out GeoArea @return)
        {
            @return = null;
            try
            {
                @return = Parse(data);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public override bool Equals(object obj)
        {
            var _loc = obj.As<GeoArea>();
            if (_loc == null) return false;

            if (PointCount == 0 || _loc.PointCount == 0) return false;

            var x_locs = _loc.GeoLocations.Select(_l => _l.Clone().With(new { Arc = Arc.Degrees })).ToArray();
            var y_locs = GeoLocations.Select(_l => _l.Clone().With(new { Arc = Arc.Degrees })).ToArray();

            x_locs = x_locs.Splice(x_locs.PositionOf(y_locs.FirstOrDefault())).ToArray();

            return y_locs.SequenceEqual(x_locs);
        }

        public override int GetHashCode()
            => GeoLocations.OrderBy(l => l.Latitude)
                           .ThenBy(l => l.Longitude)
                           .ThenBy(l => l.Altitude)
                           .Pipe(_locations => ValueHash(_locations));

    }
}
