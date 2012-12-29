using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement;

namespace Pharmalto.Ecosystem.Models
{
    public class ProfilesPart : ContentPart
    {
        IEnumerable<Profile> Profiles { get; set; }
    }
}