using Axis.Narvi.Notify;
using System;
using System.ComponentModel;
using static Axis.Luna.Extensions.ObjectExtensions;

namespace Gaia.Core.Domain
{
    public abstract class GaiaEntity<Key> : NotifierBase, IEquatable<GaiaEntity<Key>>
    {
        public virtual Key EntityId
        {
            get { return get<Key>(); }
            set { set(ref value); }
        }

        public virtual DateTime CreatedOn
        {
            get { return get<DateTime>(); }
            set { set(ref value); }
        }

        public virtual DateTime? ModifiedOn
        {
            get { return get<DateTime?>(); }
            set { set(ref value); }
        }

        public virtual string CreatedBy
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public virtual string ModifiedBy
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        protected override void OnPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            base.OnPropertyChanged(sender, e);
            if (e.PropertyName != nameof(ModifiedOn) &&
                e.PropertyName != nameof(CreatedOn)) this.ModifiedOn = DateTime.Now;
        }

        public virtual bool Equals(GaiaEntity<Key> other) => other?.EntityId.Equals(EntityId) ?? false;

        public override bool Equals(object obj) => Equals(obj.As<GaiaEntity<Key>>());
        public override int GetHashCode() => Eval(() => EntityId.GetHashCode());


        public GaiaEntity()
        {
            CreatedOn = DateTime.Now;
        }
    }
}
