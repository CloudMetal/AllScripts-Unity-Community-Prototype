using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;
using Pharmalto.Ecosystem.Models;

namespace Pharmalto.Ecosystem.Drivers
{
    public class ProfilesPartDriver : ContentPartDriver<ProfilesPart>
    {
        protected override DriverResult Display(
            ProfilesPart part, string displayType, dynamic shapeHelper)
        {

            return ContentShape("Parts_Profiles", () => shapeHelper.Parts_Medicine(
                Profiles: part));
        }

        //GET
        protected override DriverResult Editor(
            ProfilesPart part, dynamic shapeHelper)
        {

            return ContentShape("Parts_Profiles_Edit",
                () => shapeHelper.EditorTemplate(
                    TemplateName: "Parts/Profiles",
                    Model: part,
                    Prefix: Prefix));
        }
        //POST
        protected override DriverResult Editor(
            ProfilesPart part, IUpdateModel updater, dynamic shapeHelper)
        {

            updater.TryUpdateModel(part, Prefix, null, null);
            return Editor(part, shapeHelper);
        }
    }
}