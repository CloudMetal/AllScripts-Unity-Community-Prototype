using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement;

namespace CloudMetal.AllScripts.Models
{
    public class DoctorPart : ContentPart<DoctorPartRecord>
    {
        public Doctor Doctor {
            get { return Record.Doctor; }
            set { Record.Doctor = value; }
        }

        public string FirstName {
            get {
                if (Record.Doctor != null)
                    return Record.Doctor.FirstName;
                return null;
            }

            set {
                if (Record.Doctor != null) {
                    Record.Doctor.FirstName = value;
                }
            }
        }

        public string LastName
        {
            get
            {
                if (Record.Doctor != null)
                    return Record.Doctor.LastName;
                return null;
            }

            set
            {
                if (Record.Doctor != null)
                {
                    Record.Doctor.LastName = value;
                }
            }
        }
    }
}