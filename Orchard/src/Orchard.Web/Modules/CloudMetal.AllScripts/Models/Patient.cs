using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CloudMetal.AllScripts.Models
{
    public class Patient
    {
        public virtual int Id { get; set; }
        public virtual string FirstName { get; set; }
        public virtual string LastName { get; set; }
        public virtual int UnityPersonId { get; set; }
        public virtual IList<Doctor> Doctors { get; set; }
    }
}