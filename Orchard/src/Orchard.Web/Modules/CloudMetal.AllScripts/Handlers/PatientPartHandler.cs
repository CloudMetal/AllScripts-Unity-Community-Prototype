using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using Orchard.ContentManagement.Handlers;
using Orchard.Data;

namespace CloudMetal.AllScripts.Handlers
{
    public class PatientPartHandler : ContentHandler
    {
        public PatientPartHandler(IRepository<PatientPartRecord> repository)
        {
            Filters.Add(new ActivatingFilter<PatientPart>("User"));
            Filters.Add(StorageFilter.For(repository));
        }
    }
}