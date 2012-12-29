using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;

namespace CloudMetal.AllScripts.Drivers
{
    public class PatientPartDriver : ContentPartDriver<PatientPart>
    {
        protected override DriverResult Display(
            PatientPart part, string displayType, dynamic shapeHelper)
        {

            return ContentShape("Parts_Patient", () => shapeHelper.Parts_Patient(
                Patient: part));
        }

        //GET
        protected override DriverResult Editor(
            PatientPart part, dynamic shapeHelper)
        {

            return ContentShape("Parts_Patient_Edit",
                () => shapeHelper.EditorTemplate(
                    TemplateName: "Parts/Patient",
                    Model: part,
                    Prefix: Prefix));
        }
        //POST
        protected override DriverResult Editor(
            PatientPart part, IUpdateModel updater, dynamic shapeHelper)
        {

            updater.TryUpdateModel(part, Prefix, null, null);
            return Editor(part, shapeHelper);
        }
    }
}