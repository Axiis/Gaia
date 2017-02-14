using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.EnumerableExtensions;
using Axis.Jupiter.Europa;
using Axis.Pollux.Identity.OAModule;
using Axis.Pollux.Authentication.OAModule;
using Axis.Pollux.RBAC.OAModule;
using Gaia.Core.OAModule;
using Gaia.Core.Domain.MarketPlace;

namespace Playground
{
    class Program
    {
        static void Main(string[] args)
        {

            var serializerSettings = new JsonSerializerSettings
            {
                Converters = Enumerate<JsonConverter>()
                                .Append(new Axis.Apollo.Json.TimeSpanConverter())
                                .Append(new Axis.Apollo.Json.DateTimeConverter())
                                .ToList(),
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Ignore,
                ObjectCreationHandling = ObjectCreationHandling.Auto,
                FloatFormatHandling = FloatFormatHandling.DefaultValue,
                PreserveReferencesHandling = PreserveReferencesHandling.None,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                StringEscapeHandling = StringEscapeHandling.Default,
                Formatting = Formatting.Indented
            };

            var config = new ContextConfiguration<EuropaContext>()
                .WithConnection("server=(local);database=GaiaDb;user id=sa;password=developer;Max Pool Size=1000;Min Pool Size=10;pooling=true;multipleactiveresultsets=True;")
                .WithEFConfiguraton(_efc =>
                {
                    _efc.LazyLoadingEnabled = false;
                    _efc.ProxyCreationEnabled = false;
                })
                .WithInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<EuropaContext>())
                .UsingModule(new IdentityAccessModuleConfig())
                .UsingModule(new AuthenticationAccessModuleConfig())
                .UsingModule(new RBACAccessModuleConfig())
                .UsingModule(new GaiaDomainModuleConfig());

            var context = new EuropaContext(config);

            Product product = context.Store<Product>().Query.FirstOrDefault();

            var json = 
            @"
{
	'$id': '2',
	'TransactionId': 'P-G04-82Y8-EVR62C',
	'Title': 'Serenity',
	'Description': 'hemsworth',
	'StockCount': 0,
	'Cost': 205,
	'Status': 0,
	'Owner': {
		'$id': '3',
		'UserId': 'stanley.damasus@gmail.com',
		'Status': 1,
		'UId': 'a8aa6cae-78b0-4188-ae51-3d695c863b8c',
		'EntityId': 'stanley.damasus@gmail.com',
		'CreatedOn': {
			'year': 2017,
			'month': 2,
			'day': 7,
			'hour': 15,
			'minute': 42,
			'second': 27,
			'millisecond': 423
		},
		'ModifiedOn': {
			'year': 2017,
			'month': 2,
			'day': 7,
			'hour': 15,
			'minute': 54,
			'second': 55,
			'millisecond': 303
		}
	},
	'Images': [
        {
			'$id': '2',
			'Uri': 'http://localhost:1116/Content/Blob/GdELB6ij6qxg3TXujNdZqlLUNqpxnkiPuv1VqLRV.jpg',
			'Metadata': 'name:d35b99b445b07a45c71adf4ac68adc1b.jpg;'
		},
		{
			'$id': '3',
			'Uri': 'http://localhost:1116/Content/Blob/ncoaaymTYcBbCKgMbhTMX8CnRl6NaOmECv41EfDo.jpg',
			'Metadata': 'name:439f0fe1-dee9-46f1-8118-d75b9c8cd863.jpg;'
		}
	],
	'EntityId': 1,
	'CreatedOn': {
		'year': 2017,
		'month': 2,
		'day': 10,
		'hour': 23,
		'minute': 40,
		'second': 4,
		'millisecond': 700
	},
	'ModifiedOn': {
		'year': 2017,
		'month': 2,
		'day': 11,
		'hour': 10,
		'minute': 40,
		'second': 17,
		'millisecond': 325
	},
	'ModifiedBy': 'stanley.damasus@gmail.com',
	'ItemType': 0
}
";

            json = JsonConvert.SerializeObject(product, serializerSettings);

            Console.WriteLine(json);

            var _product = JsonConvert.DeserializeObject<Product>(json, serializerSettings);

            Console.WriteLine(_product);

        }
    }
}
