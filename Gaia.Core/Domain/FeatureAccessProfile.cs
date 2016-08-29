using Gaia.Core.Domain.Meta;
using System;
using System.Collections.Generic;

namespace Gaia.Core.Domain
{
    public class FeatureAccessProfile: GaiaEntity<long>
    {

        public string AccessCode
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string Title
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public string Description
        {
            get { return get<string>(); }
            set { set(ref value); }
        }

        public FeatureAccessProfileStatus Status
        {
            get { return get<FeatureAccessProfileStatus>(); }
            set { set(ref value); }
        }

        /// <summary>
        /// IGNORE THIS IN THE ENTITY MAPPING!!!!
        /// </summary>
        public ICollection<FeatureAccessDescriptor> AccessDescriptors { get; private set; }


        public FeatureAccessProfile()
        {
            this.AccessCode = $"[{Guid.NewGuid().ToString()}]";
            this.AccessDescriptors = new List<FeatureAccessDescriptor>();
        }
    }

    public enum FeatureAccessProfileStatus
    {
        Active,
        Archived
    }
}
