using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using Orchard.ContentManagement.Handlers;
using Orchard.Data;

namespace CloudMetal.AllScripts.Handlers
{
    public class DoctorPartHandler : ContentHandler
    {
        public DoctorPartHandler(IRepository<DoctorPartRecord> repository) {
            Filters.Add(new ActivatingFilter<DoctorPart>("User"));
            Filters.Add(StorageFilter.For(repository));
        }
    }
}