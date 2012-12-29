using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CloudMetal.AllScripts.Models;
using Orchard;

namespace CloudMetal.AllScripts.Services
{
    public interface IDoctorService : IDependency {
        IQueryable<Doctor> GetUnityDoctors();
        IQueryable<Patient> GetUnityPatients();
        Doctor AssociateDoctor(Doctor doctor, DoctorPart doctorPart
            );
    }
}
