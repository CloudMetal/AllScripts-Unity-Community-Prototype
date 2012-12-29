/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

﻿using System.Linq;
using Orchard.Data;
using TheMetroTheme.Models;

namespace TheMetroTheme.Services
{
    public class SettingsService : IThemeSettingsService
    {
        private readonly IRepository<ThemeSettingsRecord> _repository;

        public SettingsService(IRepository<ThemeSettingsRecord> repository)
        {
            _repository = repository;
        }

        public ThemeSettingsRecord GetSettings()
        {
            var settings = _repository.Table.SingleOrDefault();
            if (settings == null)
            {
                _repository.Create(settings = new ThemeSettingsRecord());
            }

            return settings;
        }
    }
}
