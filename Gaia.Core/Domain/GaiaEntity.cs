using Axis.Narvi.Notify;
using System;
using System.ComponentModel;
using static Axis.Luna.Extensions.ObjectExtensions;

namespace Gaia.Core.Domain
{
    public abstract class GaiaEntity<Key> : NotifierBase, IEquatable<GaiaEntity<Key>>, IBaseHash
    {
        public Key EntityId
        {
            get { return get<Key>(); }
            set { set(ref value); }
        }

        public DateTime CreatedOn
        {
            get { return get<DateTime>(); }
            set { set(ref value); }
        }

        public DateTime? ModifiedOn
        {
            get { return get<DateTime?>(); }
            set { set(ref value); }
        }

        public string CreatedBy
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string ModifiedBy
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        private int _bh = 0;
        public int BaseHash() => _bh;

        protected override void OnPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            base.OnPropertyChanged(sender, e);
            if (e.PropertyName != nameof(ModifiedOn) &&
                e.PropertyName != nameof(CreatedOn)) this.ModifiedOn = DateTime.Now;
        }

        public virtual bool Equals(GaiaEntity<Key> other)
        {
            if (other == null) return false;
            else if (default(Key).Equals(other.EntityId)) return other.BaseHash() == BaseHash();
            else return other.EntityId.Equals(EntityId);
        }

        public override bool Equals(object obj) => Equals(obj.As<GaiaEntity<Key>>());
        public override int GetHashCode() => Eval(() => EntityId.GetHashCode());


        public GaiaEntity()
        {
            CreatedOn = DateTime.Now;
            this._bh = base.GetHashCode();
        }
    }
}
