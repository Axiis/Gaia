namespace Gaia.Core.Domain.Meta
{

    public class FeatureURI: GaiaEntity<int>
    {
        public virtual string URI
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string Name
        {
            get { return get<string>(); }
            set { set(ref value); }
        }
    }
}
