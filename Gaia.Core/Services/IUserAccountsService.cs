using Axis.Luna;
using Gaia.Core.Domain;
using Gaia.Core.System;
using Gaia.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Accounts = Gaia.Core.Domain.Accounts;

namespace Gaia.Core.Services
{
    public interface IUserAccountsService: IGaiaService, IUserContextAware
    {

        [Feature("system/UserAccounts/Services/@add")]
        Operation<long> AddServiceAccount(Accounts.Service data);

        [Feature("system/UserAccounts/Services/@modify")]
        Operation ModifyServiceAccount(Accounts.Service data);

        [Feature("system/UserAccounts/Services/@remove")]
        Operation RemoveServiceAccount(long[] ids);

        [Feature("system/UserAccounts/Services/@get")]
        Operation<IEnumerable<Accounts.Service>> GetServiceAccounts();


        [Feature("system/UserAccounts/Farms/@add")]
        Operation<long> AddFarmAccount(Accounts.Farm data);

        [Feature("system/UserAccounts/Farms/@modify")]
        Operation ModifyFarmAccount(Accounts.Farm data);

        [Feature("system/UserAccounts/Farms/@remove")]
        Operation RemoveFarmAccount(long[] ids);

        [Feature("system/UserAccounts/Farms/@get")]
        Operation<IEnumerable<Accounts.Farm>> GetFarmAccounts();
    }
}
