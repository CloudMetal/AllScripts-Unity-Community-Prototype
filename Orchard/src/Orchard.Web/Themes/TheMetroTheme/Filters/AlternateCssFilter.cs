/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

﻿using System;
using System.Web;
using System.Web.Mvc;
using Orchard.Mvc.Filters;
using Orchard.UI.Admin;
using Orchard.UI.Resources;
using Orchard.Utility.Extensions;
using TheMetroTheme.Services;
using Orchard;
using Orchard.Themes.Services;

namespace TheMetroTheme.Filters
{
    public class AlternateCssFilter : FilterProvider, IResultFilter 
    {
        private readonly IThemeSettingsService _settingsService;
        private readonly IResourceManager _resourceManager;
        private readonly ISiteThemeService _siteThemeService;

        public AlternateCssFilter(IThemeSettingsService settingsService,
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

            var viewResult = filterContext.Result as ViewResult;
            if (viewResult == null)
                return;

            var themeName = _siteThemeService.GetSiteTheme();
            if (themeName.Name == Constants.THEME_NAME)
            {
                this.AddMeta();              
                this.AddCss();
            }
        }

        private void AddCss()
        {
            var settings = _settingsService.GetSettings();

            // Add Base Structure, Base and Accent Color Theme and Media Queries CSS
            _resourceManager.Require("stylesheet", ResourceManifest.CORE_STYLE)
                            .AtHead();

            if (!String.IsNullOrEmpty(settings.BackgroundCss))
                _resourceManager.Require("stylesheet", settings.BackgroundCss)
                                .AtHead();

            if (!String.IsNullOrEmpty(settings.AccentCss))
                _resourceManager.Require("stylesheet", settings.AccentCss)
                                .AtHead();

            _resourceManager.Require("stylesheet", ResourceManifest.MEDIA_QUERIES_STYLE)
                            .AtHead();

            // Add Hack CSS
            _resourceManager.Require("stylesheet", ResourceManifest.IE7_HACK_STYLE)
                            .UseCondition("IE 7")
                            .AtHead();

            //_resourceManager.Require("stylesheet", ResourceManifest.IE6_HACK_STYLE)
            //                .UseCondition("IE 6")
            //                .AtHead();

            // Add Custom CSS if request
            if (settings.UseCustomCss)
                _resourceManager.Require("stylesheet", ResourceManifest.CUSTOM_STYLE)
                                .AtHead();

            // Add Respond.js v1.1.0
            _resourceManager.Require("script", ResourceManifest.RESPOND_SCRIPT)
                            .UseCondition("lt IE 9")
                            .AtHead();
        }

        private void AddMeta()
        {
            // Insert Meta Tags
            _resourceManager.SetMeta(new MetaEntry()
            {
                Name = "viewport",
                Content = "width=device-width",
            });
        }
        
        public void OnResultExecuted(ResultExecutedContext filterContext)
        {
        }
    }
}
