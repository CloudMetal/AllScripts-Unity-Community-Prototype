﻿using Orchard.ContentManagement.MetaData;
using Orchard.Core.Contents.Extensions;
using Orchard.Data.Migration;
using Orchard.Environment.Extensions;

namespace Orchard.AntiSpam {
    public class Migrations : DataMigrationImpl {

        public int Create() {
            
            ContentDefinitionManager.AlterPartDefinition("SubmissionLimitPart", cfg => cfg
                .Attachable()
                );

            ContentDefinitionManager.AlterPartDefinition("ReCaptchaPart", cfg => cfg
                .Attachable()
                );

            SchemaBuilder.CreateTable("ReCaptchaSettingsPartRecord",
                table => table.ContentPartVersionRecord()
                    .Column<string>("PublicKey")
                    .Column<string>("PrivateKey")
                    .Column<bool>("TrustAuthenticatedUsers")
                );

            ContentDefinitionManager.AlterPartDefinition("SpamFilterPart", cfg => cfg
                .Attachable()
                );

            SchemaBuilder.CreateTable("SpamFilterPartRecord",
                table => table.ContentPartVersionRecord()
                    .Column<string>("Status", c => c.WithLength(64))
                );

            return 2;
        }

        public int UpdateFrom1() {

            SchemaBuilder.CreateTable("ReCaptchaSettingsPartRecord",
                table => table.ContentPartVersionRecord()
                    .Column<string>("PublicKey")
                    .Column<string>("PrivateKey")
                    .Column<bool>("TrustAuthenticatedUsers")
                );

            return 2;
        }
    }


    [OrchardFeature("Akismet.Filter")]
    public class AkismetMigrations : DataMigrationImpl {

        public int Create() {

            SchemaBuilder.CreateTable("AkismetSettingsPartRecord",
                table => table.ContentPartVersionRecord()
                    .Column<bool>("TrustAuthenticatedUsers")
                    .Column<string>("ApiKey")
                );

            return 1;
        }
    }


    [OrchardFeature("TypePad.Filter")]
    public class TypePadMigrations : DataMigrationImpl {

        public int Create() {

            SchemaBuilder.CreateTable("TypePadSettingsPartRecord",
                table => table.ContentPartVersionRecord()
                    .Column<bool>("TrustAuthenticatedUsers")
                    .Column<string>("ApiKey")
                );

            return 1;
        }
    }
}