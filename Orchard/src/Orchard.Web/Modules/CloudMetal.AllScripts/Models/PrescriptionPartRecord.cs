using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement.Records;

namespace CloudMetal.AllScripts.Models
{
    public class PrescriptionPartRecord : ContentPartRecord
    {
        public virtual int PatientId { get; set; }
        public virtual int DoctorId { get; set; }
    }
}