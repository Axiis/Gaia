var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Axis;
(function (Axis) {
    var Pollux;
    (function (Pollux) {
        var Domain;
        (function (Domain) {
            (function (Access) {
                Access[Access["Public"] = 0] = "Public";
                Access[Access["Secret"] = 1] = "Secret";
            })(Domain.Access || (Domain.Access = {}));
            var Access = Domain.Access;
            (function (Gender) {
                Gender[Gender["Female"] = 0] = "Female";
                Gender[Gender["Male"] = 1] = "Male";
                Gender[Gender["Other"] = 2] = "Other";
            })(Domain.Gender || (Domain.Gender = {}));
            var Gender = Domain.Gender;
            var PolluxEntity = (function () {
                function PolluxEntity(data) {
                    if (data) {
                        data.copyTo(this);
                        this.CreatedOn = data['CreatedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['CreatedOn']) : null;
                        this.ModifiedOn = data['ModifiedOn'] ? new Axis.Apollo.Domain.JsonDateTime(data['ModifiedOn']) : null;
                    }
                }
                return PolluxEntity;
            }());
            Domain.PolluxEntity = PolluxEntity;
            var AddressData = (function (_super) {
                __extends(AddressData, _super);
                function AddressData(data) {
                    _super.call(this, data);
                    if (data) {
                        this.Owner = data['Owner'] ? new User(data['Owner']) : null;
                    }
                }
                return AddressData;
            }(PolluxEntity));
            Domain.AddressData = AddressData;
            var BioData = (function (_super) {
                __extends(BioData, _super);
                function BioData(data) {
                    _super.call(this, data);
                    if (data) {
                        this.Dob = data['Dob'] ? new Axis.Apollo.Domain.JsonDateTime(data['Dob']) : null;
                        this.Owner = data['Owner'] ? new User(data['Owner']) : null;
                    }
                }
                return BioData;
            }(PolluxEntity));
            Domain.BioData = BioData;
            var ContactData = (function (_super) {
                __extends(ContactData, _super);
                function ContactData(data) {
                    _super.call(this, data);
                    if (data) {
                        this.Owner = data['Owner'] ? new User(data['Owner']) : null;
                    }
                }
                return ContactData;
            }(PolluxEntity));
            Domain.ContactData = ContactData;
            var CorporateData = (function (_super) {
                __extends(CorporateData, _super);
                function CorporateData(data) {
                    _super.call(this, data);
                    this.Status = Gaia.Utils.BusinessStatus_Draft;
                    if (data) {
                        this.IncorporationDate = data['IncorporationDate'] ? new Axis.Apollo.Domain.JsonDateTime(data['IncorporationDate']) : null;
                        this.Owner = data['Owner'] ? new User(data['Owner']) : null;
                    }
                }
                return CorporateData;
            }(PolluxEntity));
            Domain.CorporateData = CorporateData;
            var User = (function (_super) {
                __extends(User, _super);
                function User(data) {
                    _super.call(this, data);
                    if (data) {
                    }
                }
                return User;
            }(PolluxEntity));
            Domain.User = User;
            var UserData = (function (_super) {
                __extends(UserData, _super);
                function UserData(data) {
                    _super.call(this, data);
                    if (data) {
                        this.Owner = data['Owner'] ? new User(data['Owner']) : null;
                    }
                }
                return UserData;
            }(PolluxEntity));
            Domain.UserData = UserData;
            var CredentialMetadata = (function () {
                function CredentialMetadata(Name, Access) {
                    this.Name = Name;
                    this.Access = Access;
                }
                return CredentialMetadata;
            }());
            Domain.CredentialMetadata = CredentialMetadata;
            var Credential = (function (_super) {
                __extends(Credential, _super);
                function Credential(data) {
                    _super.call(this, data);
                    if (data) {
                        this.Owner = data['Owner'] ? new User(data['Owner']) : null;
                        this.Expires = data['Expires'] ? new Axis.Apollo.Domain.JsonTimeSpan(data['Expires']) : null;
                    }
                }
                return Credential;
            }(PolluxEntity));
            Domain.Credential = Credential;
        })(Domain = Pollux.Domain || (Pollux.Domain = {}));
    })(Pollux = Axis.Pollux || (Axis.Pollux = {}));
})(Axis || (Axis = {}));
