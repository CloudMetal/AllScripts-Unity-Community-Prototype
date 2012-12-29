/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/
﻿
using Orchard;
using Orchard.Localization;
using Orchard.Themes.Services;
using Orchard.UI.Navigation;

namespace TheMetroTheme
{
    public class AdminMenu : INavigationProvider
    {
        private readonly ISiteThemeService _siteThemeService;

        public Localizer T { get; set; }
        public string MenuName { get { return "admin"; } }

        public AdminMenu(ISiteThemeService siteThemeService)
        {
            _siteThemeService = siteThemeService;
        }

        public void GetNavigation(NavigationBuilder builder)
        {
            var themeName = _siteThemeService.GetSiteTheme();
            if (themeName.Name == Constants.THEME_NAME)
            {
                builder.Add(T("Themes"), "10", BuildMenu);
            }
        }

        private void BuildMenu(NavigationItemBuilder menu)
        {
            menu.Add(T("Base Settings"), "10.1", 
                item => item
                        .Action("Index", "Admin", new { area = Constants.ROUTES_AREA_NAME })
                        .Permission(TheMetroTheme.Permissions.ManageThemeSettings)
            );
            menu.Add(T("Custom CSS"), "10.2",
                item => item
                        .Action("CustomCss", "Admin", new { area = Constants.ROUTES_AREA_NAME })
                        .Permission(TheMetroTheme.Permissions.ManageThemeSettings)
            );
        }
    }
}