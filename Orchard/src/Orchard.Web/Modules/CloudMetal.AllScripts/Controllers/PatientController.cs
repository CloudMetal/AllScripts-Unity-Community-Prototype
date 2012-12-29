using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Orchard.Themes;

namespace CloudMetal.AllScripts.Controllers
{
    [Themed]
    public class PatientController : Controller
    {
        public ActionResult Associate() {
            return View();
        }
    }
}