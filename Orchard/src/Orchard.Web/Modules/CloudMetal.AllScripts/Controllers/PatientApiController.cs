using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using CloudMetal.AllScripts.Models;
using CloudMetal.AllScripts.Services;

namespace CloudMetal.AllScripts.Controllers
{
    public class PatientApiController : ApiController {
        private readonly IDoctorService _doctorService;
        public PatientApiController(IDoctorService doctorService) {
            _doctorService = doctorService;
        }

        [Queryable]
        public IQueryable<Patient> GetAll() {
            return _doctorService.GetUnityPatients();
        }
    }
}