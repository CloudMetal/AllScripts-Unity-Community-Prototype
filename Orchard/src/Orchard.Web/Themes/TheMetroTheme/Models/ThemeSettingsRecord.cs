/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

using Orchard.ContentManagement.Records;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TheMetroTheme.Models
{
    public class ThemeSettingsRecord
    {
        public ThemeSettingsRecord()
        {
            this.AccentCss = Constants.ACCENT_CSS_DEFAULT;
            this.BackgroundCss = Constants.BACKGROUND_CSS_DEFAULT;
            this.UseBranding = true;
        }

        public virtual int Id { get; set; }
        public virtual string AccentCss { get; set; }
        public virtual string BackgroundCss { get; set; }
        public virtual string Tagline { get; set; }
        public virtual bool UseBranding { get; set; }
        public virtual bool UseCustomCss { get; set; }
    }
}