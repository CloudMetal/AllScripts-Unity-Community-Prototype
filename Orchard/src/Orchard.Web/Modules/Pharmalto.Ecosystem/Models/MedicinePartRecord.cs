using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement.Records;

namespace Pharmalto.Ecosystem.Models
{
    public class MedicinePartRecord : ContentPartRecord
    {
        public virtual Medicine Medicine { get; set; }
    }
}