using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CloudMetal.AllScripts.Models;
using Orchard;

namespace CloudMetal.AllScripts.Clients
{
    public interface IUnityClient : IDependency {
        string GetToken();
        IEnumerable<Doctor> GetDoctors();
        IEnumerable<Patient> GetPatients();
    }
}
