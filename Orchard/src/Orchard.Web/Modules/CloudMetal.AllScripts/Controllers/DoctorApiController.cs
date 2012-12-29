using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using CloudMetal.AllScripts.Models;
using CloudMetal.AllScripts.Services;
using CloudMetal.AllScripts.WebApi;
using Orchard;
using Orchard.ContentManagement;

namespace CloudMetal.AllScripts.Controllers
{
    public class DoctorApiController : ApiController {
        private readonly IDoctorService _doctorService;
        private readonly IOrchardServices _orchardServices;
        public DoctorApiController(IDoctorService doctorService,
                                   IOrchardServices orchardServices) {
            _orchardServices = orchardServices;
            _doctorService = doctorService;
        }

        [Queryable]
        public IQueryable<Doctor> GetAll() {
            return _doctorService.GetUnityDoctors();
        } 

        [ValidationActionFilter]
        public HttpResponseMessage Post(Doctor doctor) {
            var doctorPart = _orchardServices.WorkContext.CurrentUser.As<DoctorPart>();
            var doc = _doctorService.AssociateDoctor(doctor, doctorPart);
            return Request.CreateResponse<Doctor>(HttpStatusCode.Created, doc);
        }
    }
}