using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CloudMetal.AllScripts.Clients;
using CloudMetal.AllScripts.Models;
using Orchard;
using Orchard.Data;

namespace CloudMetal.AllScripts.Services
{
    public class DoctorService : IDoctorService {
        private readonly IOrchardServices _orchardServices;
        private readonly IRepository<Doctor> _doctorRepository;
        private readonly IPatientService _patientService;
        private readonly ITransactionManager _transactionManager;
        private readonly IUnityClient _unityClient;

        public DoctorService(IOrchardServices orchardServices,
                             IRepository<Doctor> doctorRepository,
            IUnityClient unityClient) {
            _orchardServices = orchardServices;
            _doctorRepository = doctorRepository;
            _unityClient = unityClient;
        }

        public IQueryable<Doctor> GetUnityDoctors() {
            return _unityClient.GetDoctors().AsQueryable();
        }


        public Doctor AssociateDoctor(Doctor doctor, DoctorPart doctorPart)
        {
            if (doctor.Id == 0) {
                _doctorRepository.Create(doctor);
            }

            doctorPart.Doctor = doctor;

            _orchardServices.ContentManager.Publish(doctorPart.ContentItem);

            return doctor;
        }


        public IQueryable<Patient> GetUnityPatients() {
            return _unityClient.GetPatients().AsQueryable();
        }
    }
}