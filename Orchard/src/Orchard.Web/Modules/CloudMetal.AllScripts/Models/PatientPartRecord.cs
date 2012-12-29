using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement.Records;

namespace CloudMetal.AllScripts.Models
{
    public class PatientPartRecord : ContentPartRecord
    {
        public virtual Patient Patient { get; set; }
    }
}