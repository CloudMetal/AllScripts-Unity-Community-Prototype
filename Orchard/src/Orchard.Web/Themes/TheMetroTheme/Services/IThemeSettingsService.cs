/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

using TheMetroTheme.Models;
using Orchard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TheMetroTheme.Services
{
    public interface IThemeSettingsService : IDependency
    {
        ThemeSettingsRecord GetSettings();

    }
}
