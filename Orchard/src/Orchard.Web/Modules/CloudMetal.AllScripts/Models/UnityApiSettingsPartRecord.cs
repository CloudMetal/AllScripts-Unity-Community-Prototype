using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement.Records;

namespace CloudMetal.AllScripts.Models
{
    public class UnityApiSettingsPartRecord : ContentPartRecord
    {
        public virtual string AppName { get; set; }
        public virtual string ServiceUser { get; set; }
        public virtual string ServicePassword { get; set; }
    }
}