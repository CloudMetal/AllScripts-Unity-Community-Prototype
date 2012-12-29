using System;
using System.Collections.Generic;
using System.Data;
using Orchard.ContentManagement.Drivers;
using Orchard.ContentManagement.MetaData;
using Orchard.ContentManagement.MetaData.Builders;
using Orchard.Core.Contents.Extensions;
using Orchard.Data.Migration;

namespace CloudMetal.AllScripts {
    public class Migrations : DataMigrationImpl {

        public int Create() {

            SchemaBuilder.CreateTable("Patient", table => table
                .Column<int>("Id", column => column.PrimaryKey().Identity())
                .Column<string>("FirstName")
                .Column<string>("LastName")
                .Column<int>("UnityPersonId")
                );

            SchemaBuilder.CreateTable("PatientPartRecord", table => table
                .ContentPartRecord()
                .Column<int>("Patient_Id")
                );

            SchemaBuilder.CreateTable("Doctor", table => table
                .Column<int>("Id", column => column.PrimaryKey().Identity())
                .Column<string>("FirstName")
                .Column<string>("LastName")
                .Column<int>("UnityPersonId")
                );

            SchemaBuilder.CreateTable("DoctorPartRecord", table => table
                .ContentPartRecord()
                .Column<int>("Doctor_Id")
                );

            SchemaBuilder.CreateTable("DoctorPatient", table => table
                .Column<int>("Id", column => column.PrimaryKey().Identity())
                .Column<int>("Doctor_Id")
                .Column<int>("Patient_Id")
                );

            SchemaBuilder.CreateForeignKey("FK_DoctorPatient",
                                           "CloudMetal.AllScripts", "DoctorPatient", new string[] { "Doctor_Id" },
                                           "CloudMetal.AllScripts", "Doctor", new string[] {"Id"});

            SchemaBuilder.CreateForeignKey("FK_PatientDoctor",
                                           "CloudMetal.AllScripts", "DoctorPatient", new string[] { "Patient_Id" },
                                           "CloudMetal.AllScripts", "Patient", new string[] { "Id" });


            ContentDefinitionManager.AlterPartDefinition("PatientPart",
                builder => builder.Attachable());

            ContentDefinitionManager.AlterPartDefinition("DoctorPart",
                builder => builder.Attachable());

            return 1;
        }

        public int UpdateFrom1() {

            ContentDefinitionManager.AlterTypeDefinition("UnityUserManagement",
                cfg => cfg
                    .WithPart("UnityUserManagementPart")
                    .WithPart("CommonPart")
                    .WithPart("WidgetPart")
                    .WithSetting("Stereotype", "Widget")
                );

            return 2;
        }

        public int UpdateFrom2() {
            SchemaBuilder.CreateTable("UnityApiSettingsPartRecord", table => table
                .ContentPartRecord()
                .Column<string>("AppName")
                .Column<string>("ServiceUser")
                .Column<string>("ServicePassword")
                );

            return 3;
        }

        public int UpdateFrom3() {
            ContentDefinitionManager.AlterTypeDefinition("Patients",
                cfg => cfg
                    .WithPart("PatientsPart")
                    .WithPart("CommonPart")
                    .WithPart("WidgetPart")
                    .WithSetting("Stereotype", "Widget")
                );

            return 4;
        }
    }
}