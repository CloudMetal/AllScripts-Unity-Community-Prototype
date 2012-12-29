using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using Orchard;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;
using Orchard.Users.Models;

namespace CloudMetal.AllScripts.Drivers
{
    public class UnityUserManagementPartDriver : ContentPartDriver<UnityUserManagementPart> {
        private readonly IOrchardServices _orchardServices;
        public UnityUserManagementPartDriver(IOrchardServices orchardServices) {
            _orchardServices = orchardServices;
        }

        protected override DriverResult Display(
            UnityUserManagementPart part, string displayType, dynamic shapeHelper) {
            var userPart = _orchardServices.WorkContext.CurrentUser.As<UserPart>();
            
            return ContentShape("Parts_UnityUserManagement", () => shapeHelper.Parts_UnityUserManagement(
                User: userPart));
        }

    }
}