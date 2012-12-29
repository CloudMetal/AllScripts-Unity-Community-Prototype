using System;
using System.Collections.Generic;
using System.Data;
using Orchard.ContentManagement.Drivers;
using Orchard.ContentManagement.MetaData;
using Orchard.ContentManagement.MetaData.Builders;
using Orchard.Core.Contents.Extensions;
using Orchard.Data;
using Orchard.Data.Migration;
using Pharmalto.Ecosystem.Models;

namespace Pharmalto.Ecosystem {
    public class Migrations : DataMigrationImpl {
        private readonly IEnumerable<MedicineType> _medicineTypes =
        new List<MedicineType> {
            new MedicineType {Name = "NameBrand" },
            new MedicineType {Name = "Generic" },
            new MedicineType {Name = "Over-the-counter" },
        };

        private readonly IRepository<MedicineType> _medicineTypeRepository; 
        public Migrations(IRepository<MedicineType> medicineTypeRepository) {
            _medicineTypeRepository = medicineTypeRepository;
        }
        public int Create() {
            SchemaBuilder.CreateTable("Profile", table => table
                            .Column<int>("Id", column => column.PrimaryKey().Identity())
                            .Column<string>("Name")
                            .Column<string>("FirstName")
                            .Column<string>("LastName")
                            .Column<int>("UserPartRecord_Id")
                            );

            SchemaBuilder.CreateTable("ProfilesPartRecord", table => table
                .ContentPartRecord()
                .Column<int>("RootProfile_Id")
                );

            SchemaBuilder.CreateTable("ProfilesPartRecordProfiles", table => table
                .Column<int>("Id", column => column.PrimaryKey().Identity())
                .Column<int>("ProfilesPartRecord_Id")
                .Column<int>("Profile_Id")
                );

            SchemaBuilder.CreateTable("MedicineType", table => table
                .Column<int>("Id", column => column.PrimaryKey().Identity())
                .Column<string>("Name")
                );

            SchemaBuilder.CreateTable("Medicine", table => table
                .Column<int>("Id", column => column.PrimaryKey().Identity())
                .Column<string>("Name")
                .Column<string>("NdcCode")
                .Column<string>("FdbId")
                .Column<DateTime>("CreateDate")
                .Column<int>("MedicineType_Id")
                .Column<int>("Profile_Id")
                );

            SchemaBuilder.CreateTable("SideEffect", table => table
                .Column<int>("Id", column => column.PrimaryKey().Identity())
                .Column<DateTime>("IncidentDate")
                .Column<string>("Notes")
                .Column<DateTime>("CreateDate")
                .Column<int>("Medicine_Id")
                );

            SchemaBuilder.CreateTable("MedicinePartRecord", table => table
                .ContentPartRecord()
                .Column<int>("Medicine_Id")
                );

            SchemaBuilder.CreateForeignKey("FK_MedicineProfile",
                                           "Pharmalto.Ecosystem", "Medicine", new string[] { "Profile_Id" },
                                           "Pharmalto.Ecosystem", "Profile", new string[] { "Id" });

            SchemaBuilder.CreateForeignKey("FK_ProfileUser",
                                           "Pharmalto.Ecosystem", "Profile", new string[] { "UserPartRecord_Id" },
                                           "Orchard.Users", "UserPartRecord", new string[] { "Id" });

            SchemaBuilder.CreateForeignKey("FK_MedicineMedicineType",
                                           "Pharmalto.Ecosystem", "Medicine", new string[] { "MedicineType_Id" },
                                           "Pharmalto.Ecosystem", "MedicineType", new string[] { "Id" });


            ContentDefinitionManager.AlterPartDefinition("ProfilesPart",
                builder => builder.Attachable(false));

            ContentDefinitionManager.AlterTypeDefinition("User", type => type
                .WithPart("ProfilesPart")
                );

            ContentDefinitionManager.AlterTypeDefinition("MedicinePart",
                cfg => cfg
                    .WithPart("CommonPart", p => p
                        .WithSetting("DateEditorSettings.ShowDateEditor", "true"))
                    .WithPart("BodyPart")
                );

            return 1;
        }

        public int UpdateFrom1() {
            if (_medicineTypeRepository == null)
                throw new InvalidOperationException(
                    "Couldn't find Medicine Type repository.");
            foreach (var medicineType in _medicineTypes)
            {
                _medicineTypeRepository.Create(medicineType);
            }
            return 2;
        }
    }
}