/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

﻿using System.Web.Mvc;
using Orchard;
using Orchard.Localization;
using Orchard.UI.Notify;
using TheMetroTheme.ViewModels;
using TheMetroTheme.Services;
using System;
using System.IO;
using Orchard.UI.Admin;

namespace TheMetroTheme.Controllers
{
    [ValidateInput(false)]
    public class AdminController : Controller
    {
        private readonly IThemeSettingsService _settingsService;

        public AdminController(
            IOrchardServices services,
            IThemeSettingsService settingsService)
        {
            _settingsService = settingsService;
            Services = services;
            T = NullLocalizer.Instance;
        }

        public IOrchardServices Services { get; set; }
        public Localizer T { get; set; }

        public ActionResult Index()
        {
            var settings = _settingsService.GetSettings();

            var viewModel = new ThemeSettingsViewModel
            {
                AccentCss = settings.AccentCss,
                BackgroundCss = settings.BackgroundCss,
                Tagline = settings.Tagline,
                UseBranding = settings.UseBranding,
                UseCustomCss = settings.UseCustomCss,
            };

            /************************************************************************************
             * Custom CSS is managed in "CustomCss" action
             ************************************************************************************
             * 
             * string customCssAbsolutePath = Server.MapPath(Constants.CUSTOM_CSS_VIRTUAL_PATH);
             * if (System.IO.File.Exists(customCssAbsolutePath))
             *     viewModel.CustomCss = System.IO.File.ReadAllText(customCssAbsolutePath);
             *     
             ************************************************************************************/

            return View(viewModel);
        }

        [HttpPost]
        public ActionResult Index(ThemeSettingsViewModel viewModel)
        {
            if (!Services.Authorizer.Authorize(TheMetroTheme.Permissions.ManageThemeSettings, T("Couldn't update TheMetroTheme settings")))
                return new HttpUnauthorizedResult();

            var settings = _settingsService.GetSettings();
            settings.AccentCss = viewModel.AccentCss;
            settings.BackgroundCss = viewModel.BackgroundCss;
            settings.Tagline = viewModel.Tagline;
            settings.UseBranding = viewModel.UseBranding;

            Services.Notifier.Information(T("Your settings have been saved."));

            return View(viewModel);
        }

        public ActionResult CustomCss()
        {
            var settings = _settingsService.GetSettings();

            var viewModel = new ThemeSettingsViewModel
            {
                AccentCss = settings.AccentCss,
                BackgroundCss = settings.BackgroundCss,
                Tagline = settings.Tagline,
                UseBranding = settings.UseBranding,
                UseCustomCss = settings.UseCustomCss,
            };

            string customCssAbsolutePath = Server.MapPath(Constants.CUSTOM_CSS_VIRTUAL_PATH);
            if (System.IO.File.Exists(customCssAbsolutePath))
                viewModel.CustomCss = System.IO.File.ReadAllText(customCssAbsolutePath);

            return View(viewModel);
        }

        [HttpPost]
        public ActionResult CustomCss(ThemeSettingsViewModel viewModel)
        {
            if (!Services.Authorizer.Authorize(TheMetroTheme.Permissions.EditCustomCss, T("Couldn't update TheMetroTheme Custom CSS")))
                return new HttpUnauthorizedResult();

            var settings = _settingsService.GetSettings();

            settings.UseCustomCss = viewModel.UseCustomCss;

            try
            {
                string customCssAbsolutePath = Server.MapPath(Constants.CUSTOM_CSS_VIRTUAL_PATH);
                if (System.IO.File.Exists(customCssAbsolutePath))
                    System.IO.File.WriteAllText(customCssAbsolutePath, viewModel.CustomCss);
                Services.Notifier.Information(T("Your settings have been saved."));
            }
            catch (Exception)
            {
                Services.Notifier.Error(T("it wasn't possible to save the CSS, check permissions of a themes folder"));
            }

            return View(viewModel);
        }
    }
}
