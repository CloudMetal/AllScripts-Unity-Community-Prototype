using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Orchard.ContentManagement;

namespace CloudMetal.AllScripts.Models
{
    public class PatientPart : ContentPart<PatientPartRecord>
    {
        public Patient Patient {
            get { return Record.Patient; }
            set { Record.Patient = value; }
        }

        public string FirstName
        {
            get
            {
                if (Record.Patient != null)
                    return Record.Patient.FirstName;
                return null;
            }

            set
            {
                if (Record.Patient != null)
                {
                    Record.Patient.FirstName = value;
                }
            }
        }

        public string LastName
        {
            get
            {
                if (Record.Patient != null)
                    return Record.Patient.LastName;
                return null;
            }

            set
            {
                if (Record.Patient != null)
                {
                    Record.Patient.LastName = value;
                }
            }
        }
    }
}