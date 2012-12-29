/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

using Orchard.Mvc.Filters;
using Orchard.Themes.Services;
using Orchard.UI.Admin;
using Orchard.UI.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TheMetroTheme.Services;

namespace TheMetroTheme.Filters
{
    public class BrandingFilter : FilterProvider, IResultFilter 
    {
        private readonly IThemeSettingsService _settingsService;
        private readonly IResourceManager _resourceManager;
        private readonly ISiteThemeService _siteThemeService;

        public BrandingFilter(IThemeSettingsService settingsService,
                              IResourceManager resourceManager,
                              ISiteThemeService siteThemeService) 
        {
            _settingsService = settingsService;
            _resourceManager = resourceManager;
            _siteThemeService = siteThemeService;
        }

        public void OnResultExecuting(ResultExecutingContext filterContext) 
        {

            // ignore filter on admin pages
            if (AdminFilter.IsApplied(filterContext.RequestContext)) 
                return;

            // should only run on a full view rendering result
            if (!(filterContext.Result is ViewResult))
                return;

            var settings = _settingsService.GetSettings();

            if(String.IsNullOrEmpty(settings.AccentCss)) 
                return;

            var themeName = _siteThemeService.GetSiteTheme();
            if (themeName.Name == Constants.THEME_NAME)
            {
                var viewResult = filterContext.Result as ViewResult;
                if (viewResult == null)
                    return;

                if (settings.UseBranding) 
                {
                    /* TODO: Replace note use Items collection */
                    System.Web.HttpContext.Current.Items[Constants.ITEM_USE_BRANDING] = settings.UseBranding.ToString();
                    System.Web.HttpContext.Current.Items[Constants.ITEM_TAGLINE] = settings.Tagline;
                }
            }
        }

        public void OnResultExecuted(ResultExecutedContext filterContext)
        {
        }
    }
}
