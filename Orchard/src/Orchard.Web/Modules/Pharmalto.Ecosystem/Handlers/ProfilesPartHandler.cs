using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement.Handlers;
using Orchard.Data;
using Pharmalto.Ecosystem.Models;

namespace Pharmalto.Ecosystem.Handlers
{
    public class ProfilesPartHandler : ContentHandler
    {
        public ProfilesPartHandler(IRepository<ProfilesPartRecord> repository) {
            Filters.Add(StorageFilter.For(repository));
        }
    }
}