using Orchard.UI.Resources;

namespace Orchard.Knockout
{
    public class ResourceManifest : IResourceManifestProvider 
    {
        public void BuildManifests(ResourceManifestBuilder builder) {
            var manifest = builder.Add();
            //Change to suit your needs:
            manifest.DefineScript("ko").SetUrl("knockout-2.1.0.js", "knockout-2.1.0.debug.js").SetVersion("2.1");
            //manifest.DefineScript("ko").SetUrl("knockout-2.0.0.js", "knockout-2.0.0.debug.js").SetVersion("2.0");
            //manifest.DefineScript("ko").SetUrl("knockout-1.3.0beta.js", "knockout-1.3.0beta.debug.js").SetVersion("1.2.9");
            manifest.DefineScript("jquery.tmpl").SetUrl("jquery.tmpl.min.js", "jquery.tmpl.js").SetVersion("1.0.0pre");
            manifest.DefineScript("ko.mapping").SetUrl("knockout.mapping-2.1.2.js", "knockout.mapping-2.1.2.debug.js").SetVersion("2.1.2");
            //manifest.DefineScript("ko.mapping").SetUrl("knockout.mapping-2.0.2.js", "knockout.mapping-2.0.2.debug.js").SetVersion("2.0.2");
        }
    }
}