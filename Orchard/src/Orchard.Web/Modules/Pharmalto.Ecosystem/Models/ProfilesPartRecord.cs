using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement.Records;

namespace Pharmalto.Ecosystem.Models
{
    public class ProfilesPartRecord : ContentPartRecord
    {
        public virtual IList<Profile> Profiles { get; set; }
        public virtual Profile RootProfile { get; set; }
    }
}