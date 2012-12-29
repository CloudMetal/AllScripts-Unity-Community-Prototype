using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CloudMetal.AllScripts.ViewModels;
using Orchard.Themes;

namespace CloudMetal.AllScripts.Controllers
{
    [Themed]
    public class DoctorController : Controller
    {
        public ActionResult Associate() {
            var model = new DoctorRegisterViewModel();
            return View(model);
        }
    }
}