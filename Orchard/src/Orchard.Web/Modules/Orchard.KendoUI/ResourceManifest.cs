using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.UI.Resources;

namespace Orchard.KendoUI
{
    public class ResourceManifest : IResourceManifestProvider
    {
        public void BuildManifests(ResourceManifestBuilder builder)
        {
            var manifest = builder.Add();
            manifest.DefineScript("kendo").SetUrl("kendo.all.min.js", "kendo.all.js").SetVersion("2012.2.913");
            manifest.DefineStyle("kendo.common").SetUrl("kendo.common.min.css", "kendo.common.css").SetVersion("2012.2.913");
            manifest.DefineStyle("kendo.metro").SetUrl("kendo.metro.min.css", "kendo.metro.css").SetVersion("2012.2.913");
            manifest.DefineStyle("kendo.default").SetUrl("kendo.default.min.css", "kendo.default.css").SetVersion("2012.2.913");
            manifest.DefineStyle("kendo.blueopal").SetUrl("kendo.blueopal.min.css", "kendo.blueopal.css").SetVersion("2012.2.913");
            manifest.DefineStyle("kendo.black").SetUrl("kendo.black.min.css", "kendo.black.css").SetVersion("2012.2.913");
            manifest.DefineStyle("kendo.silver").SetUrl("kendo.silver.min.css", "kendo.silver.css").SetVersion("2012.2.913");
        }
    }
}