using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using Orchard.ContentManagement.Drivers;

namespace CloudMetal.AllScripts.Drivers
{
    public class PatientsPartDriver : ContentPartDriver<PatientsPart>
    {
        protected override DriverResult Display(
            PatientsPart part, string displayType, dynamic shapeHelper)
        {

            return ContentShape("Parts_Patients", () => shapeHelper.Parts_Patients(
                Patient: part));
        }
    }
}