using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement;

namespace CloudMetal.AllScripts.Models
{
    public class UnityApiSettingsPart : ContentPart<UnityApiSettingsPartRecord>
    {
        public string AppName
        {
            get { return Record.AppName; }
            set { Record.AppName = value; }
        }

        public string ServiceUser
        {
            get { return Record.ServiceUser; }
            set { Record.ServiceUser = value; }
        }

        public string ServicePassword
        {
            get { return Record.ServicePassword; }
            set { Record.ServicePassword = value; }
        }
    }
}