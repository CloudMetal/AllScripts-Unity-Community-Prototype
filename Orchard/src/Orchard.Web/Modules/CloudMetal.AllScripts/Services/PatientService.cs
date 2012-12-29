using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Models;
using Orchard;
using Orchard.Data;

namespace CloudMetal.AllScripts.Services
{
    public class PatientService : IPatientService
    {
        private readonly IOrchardServices _orchardServices;
        private readonly IRepository<Patient> _patientRepository;
        private readonly IDoctorService _doctorService;

        public PatientService(IOrchardServices orchardServices,
                             IRepository<Patient> patientRepository,
                             IDoctorService doctorService)
        {
            _orchardServices = orchardServices;
            _patientRepository = patientRepository;
            _doctorService = doctorService;
        }
    }
}