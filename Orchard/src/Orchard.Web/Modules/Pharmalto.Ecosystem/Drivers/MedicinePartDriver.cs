using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;
using Pharmalto.Ecosystem.Models;

namespace Pharmalto.Ecosystem.Drivers
{
    public class MedicinePartDriver : ContentPartDriver<MedicinePart> {
        protected override DriverResult Display(
            MedicinePart part, string displayType, dynamic shapeHelper)
        {

            return ContentShape("Parts_Medicine", () => shapeHelper.Parts_Medicine(
                Medicine: part));
        }

        //GET
        protected override DriverResult Editor(
            MedicinePart part, dynamic shapeHelper)
        {

            return ContentShape("Parts_Medicine_Edit",
                () => shapeHelper.EditorTemplate(
                    TemplateName: "Parts/Medicine",
                    Model: part,
                    Prefix: Prefix));
        }
        //POST
        protected override DriverResult Editor(
            MedicinePart part, IUpdateModel updater, dynamic shapeHelper)
        {

            updater.TryUpdateModel(part, Prefix, null, null);
            return Editor(part, shapeHelper);
        }
    }
}