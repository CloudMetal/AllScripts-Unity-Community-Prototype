using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement.Drivers;
using Pharmalto.Ecosystem.Models;

namespace Pharmalto.Ecosystem.Drivers
{
    public class MedicationsPartDriver : ContentPartDriver<MedicationsPart>
    {
        protected override DriverResult Display(
            MedicationsPart part, string displayType, dynamic shapeHelper)
        {

            return ContentShape("Parts_Medications", () => shapeHelper.Parts_Medications(
                Medications: part));
        }
    }
}