using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;

namespace CloudMetal.AllScripts.Drivers
{
    public class DoctorPartDriver : ContentPartDriver<DoctorPart>
    {
        protected override DriverResult Display(
            DoctorPart part, string displayType, dynamic shapeHelper)
        {

            return ContentShape("Parts_Doctor", () => shapeHelper.Parts_Doctor(
                Doctor: part));
        }

        //GET
        protected override DriverResult Editor(
            DoctorPart part, dynamic shapeHelper)
        {

            return ContentShape("Parts_Doctor_Edit",
                () => shapeHelper.EditorTemplate(
                    TemplateName: "Parts/Doctor",
                    Model: part,
                    Prefix: Prefix));
        }
        //POST
        protected override DriverResult Editor(
            DoctorPart part, IUpdateModel updater, dynamic shapeHelper)
        {

            updater.TryUpdateModel(part, Prefix, null, null);
            return Editor(part, shapeHelper);
        }
    }
}