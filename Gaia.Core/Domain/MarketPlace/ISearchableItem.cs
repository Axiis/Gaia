using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gaia.Core.Domain.MarketPlace
{
    public interface ISearchableItem
    {
        string Title { get; set; }
        string Description { get; set; }
        string Tags { get; set; }
        SearchableItemType Type { get; }
    }

    public enum SearchableItemType
    {
        Product, 
        Service
    }
}
