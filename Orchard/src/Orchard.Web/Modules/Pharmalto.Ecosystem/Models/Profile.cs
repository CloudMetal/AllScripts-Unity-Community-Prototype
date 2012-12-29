using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.Users.Models;

namespace Pharmalto.Ecosystem.Models
{
    public class Profile
    {
        public virtual int Id { get; set; }
        public virtual string Name { get; set; }
        public virtual string FirstName { get; set; }
        public virtual string LastName { get; set; }
        public virtual UserPartRecord UserPartRecord { get; set; }

        public virtual IList<Medicine> Medicines { get; set; }
    }
}