using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using JetBrains.Annotations;
using Orchard.ContentManagement;
using Orchard.ContentManagement.Handlers;
using Orchard.Data;
using Orchard.Localization;
using Orchard.Logging;

namespace CloudMetal.AllScripts.Handlers
{
    [UsedImplicitly]
    public class UnityApiSettingsPartHandler : ContentHandler
    {

        public UnityApiSettingsPartHandler(IRepository<UnityApiSettingsPartRecord> repository)
        {
            T = NullLocalizer.Instance;
            Logger = NullLogger.Instance;

            Filters.Add(new ActivatingFilter<UnityApiSettingsPart>("Site"));
            Filters.Add(StorageFilter.For(repository));
        }

        public new ILogger Logger { get; set; }

        public Localizer T { get; set; }

        protected override void GetItemMetadata(GetContentItemMetadataContext context)
        {
            if (context.ContentItem.ContentType != "Site")
                return;
            base.GetItemMetadata(context);
            context.Metadata.EditorGroupInfo.Add(new GroupInfo(T("UnityApi")));
        }
    }
}