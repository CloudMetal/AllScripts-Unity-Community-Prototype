/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TheMetroTheme.ViewModels
{
    public class ThemeSettingsViewModel
    {
        public string AccentCss { get; set; }
        public string BackgroundCss { get; set; }
        public string CustomCss { get; set; }
        public string Tagline { get; set; }
        public bool UseCustomCss { get; set; }
        public bool UseBranding { get; set; }
    }
}