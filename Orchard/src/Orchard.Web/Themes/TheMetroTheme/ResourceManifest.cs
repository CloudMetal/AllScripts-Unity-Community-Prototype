/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

using System;
using Orchard.UI.Resources;

namespace TheMetroTheme
{
    public class ResourceManifest : IResourceManifestProvider
    {
        private const string PREFIX = "THE_METRO_THEME_";

        public const string CORE_STYLE = PREFIX + "CORE_STYLE";
        public const string MEDIA_QUERIES_STYLE = PREFIX + "MEDIA_QUERIES_STYLE";
        public const string IE6_HACK_STYLE = PREFIX + "IE6_HACK_STYLE";
        public const string IE7_HACK_STYLE = PREFIX + "IE7_HACK_STYLE";
        public const string CUSTOM_STYLE = PREFIX + "CUSTOM_STYLE";

        public const string RESPOND_SCRIPT = PREFIX + "RESPOND_SCRIPT";

        public void BuildManifests(ResourceManifestBuilder builder)
        {
            var manifest = builder.Add();

            //// core scripts
            manifest.DefineScript(RESPOND_SCRIPT).SetUrl("respond.min.js");

            // core styles
            manifest.DefineStyle(CORE_STYLE).SetUrl("Base.css", "Base.debug.css");
            manifest.DefineStyle(MEDIA_QUERIES_STYLE).SetUrl("MediaQueries.css", "MediaQueries.debug.css");
            manifest.DefineStyle(IE6_HACK_STYLE).SetUrl("IE-6.css", "IE-6.debug.css");
            manifest.DefineStyle(IE7_HACK_STYLE).SetUrl("IE-7.css", "IE-7.debug.css");
            manifest.DefineStyle(CUSTOM_STYLE).SetUrl("Custom.css", "Custom.css");

            // core theme
            manifest.DefineStyle("Dark.css").SetUrl("Dark.css", "Dark.debug.css");
            manifest.DefineStyle("Light.css").SetUrl("Light.css", "Light.debug.css");

            // accent theme
            manifest.DefineStyle("Amber.css").SetUrl("Accent/Amber.css", "Accent/Amber.debug.css");
            manifest.DefineStyle("Blue.css").SetUrl("Accent/Blue.css", "Accent/Blue.debug.css");
            manifest.DefineStyle("Cyan.css").SetUrl("Accent/Cyan.css", "Accent/Cyan.debug.css");
            manifest.DefineStyle("Green.css").SetUrl("Accent/Green.css", "Accent/Green.debug.css");
            manifest.DefineStyle("Violet.css").SetUrl("Accent/Violet.css", "Accent/Violet.debug.css");
        }
    }
}

