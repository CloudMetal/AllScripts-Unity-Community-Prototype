using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace CloudMetal.AllScripts.Clients
{
    public class UnityRequest
    {
        public UnityRequest() {
            AppUserId = "";
            PatientId = "";
            Parameter1 = "";
            Parameter2 = "";
            Parameter3 = "";
            Parameter4 = "";
            Parameter5 = "";
            Parameter6 = "";
            Data = "";
        }
        public string Action { get; set; }
        public string Appname { get; set; }

        [JsonProperty("AppUserID")]
        public string AppUserId { get; set; }

        [JsonProperty("PatientID")]
        public string PatientId { get; set; }

        public string Token { get; set; }

        public string Parameter1 { get; set; }
        public string Parameter2 { get; set; }
        public string Parameter3 { get; set; }
        public string Parameter4 { get; set; }
        public string Parameter5 { get; set; }
        public string Parameter6 { get; set; }

        public string Data { get; set; }
    }
}