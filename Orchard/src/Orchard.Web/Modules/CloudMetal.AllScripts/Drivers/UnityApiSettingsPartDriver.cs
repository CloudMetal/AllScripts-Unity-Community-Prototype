using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Drivers;
using Orchard.Localization;

namespace CloudMetal.AllScripts.Drivers
{
    public class UnityApiSettingsPartDriver : ContentPartDriver<UnityApiSettingsPart>
    {
        private const string TemplateName = "Parts/UnityApiSettings";

        public UnityApiSettingsPartDriver()
        {
            T = NullLocalizer.Instance;
        }

        public Localizer T { get; set; }

        protected override string Prefix { get { return "UnityApiSettings"; } }

        protected override DriverResult Editor(UnityApiSettingsPart part, dynamic shapeHelper)
        {
            return ContentShape("Parts_UnityApiSettings_Edit",
                    () => shapeHelper.EditorTemplate(TemplateName: TemplateName, Model: part, Prefix: Prefix))
                    .OnGroup("unityapi");
        }

        protected override DriverResult Editor(UnityApiSettingsPart part, IUpdateModel updater, dynamic shapeHelper)
        {
            return ContentShape("Parts_UnityApiSettings_Edit", () =>
            {
                updater.TryUpdateModel(part, Prefix, null, null);

                return shapeHelper.EditorTemplate(TemplateName: TemplateName, Model: part, Prefix: Prefix);
            })
                .OnGroup("unityapi");
        }
    }
}