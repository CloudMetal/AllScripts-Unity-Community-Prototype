/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

using Orchard.Data.Migration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TheMetroTheme
{
    public class Migrations : DataMigrationImpl
    {
        public int Create()
        {
            SchemaBuilder.CreateTable("ThemeSettingsRecord", table => table
                .Column<int>("Id", column => column.PrimaryKey().Identity())
                .Column<string>("AccentCss", c => c.WithLength(50)
                                                  .WithDefault(Constants.ACCENT_CSS_DEFAULT))
                .Column<string>("BackgroundCss", c => c.WithLength(50)
                                                       .WithDefault(Constants.BACKGROUND_CSS_DEFAULT))
                .Column<string>("Tagline", c => c.WithLength(120))
                .Column<bool>("UseBranding")
                .Column<bool>("UseCustomCss")
            );

            return 1;
        }

        public int UpdateFrom1()
        {
            SchemaBuilder.AlterTable("ThemeSettingsRecord",
                table => table.AlterColumn("UseBranding", column => column.WithDefault(true))
            );

            SchemaBuilder.AlterTable("ThemeSettingsRecord",
                table => table.AlterColumn("UseCustomCss", column => column.WithDefault(true))
            ); 

            return 2;
        }
    }

}