using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using CloudMetal.AllScripts.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Orchard;
using Orchard.ContentManagement;

namespace CloudMetal.AllScripts.Clients
{
    public class UnityClient : HttpClient, IUnityClient {
        private readonly IOrchardServices _orchardServices;

        private readonly string TokenUserName = "webtwozero";
        private readonly string TokenPassword = "www!web20!";
        private readonly string TokenUrl = "http://eehr-11-2-a.unitysandbox.com/Unity/UnityService.svc/json/GetToken";
        private readonly string MagicUrl = "http://eehr-11-2-a.unitysandbox.com/Unity/UnityService.svc/json/MagicJson";

        public UnityClient(IOrchardServices orchardServices) {
            _orchardServices = orchardServices;

            DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/octet-stream"));
        }

        protected UnityApiSettingsPart UnitySettings {
            get {
                return _orchardServices.WorkContext.CurrentSite.As<UnityApiSettingsPart>();
            }
        }

        protected virtual string Token {
            get {
                var token = HttpContext.Current.Items["__currentTokenUnity"] as string;
                if (token == null) {
                    token = GetToken();
                    if (!string.IsNullOrEmpty(token)) {
                        HttpContext.Current.Items["__currentTokenUnity"] = token;
                    }
                    else {
                        throw new InvalidOperationException("Could not retrieve Unity API token.");
                    }
                }
                return token;
            }
        }

        protected IOrchardServices OrchardServices {
            get { return _orchardServices; }
        }

        public string GetToken() {
            string token = null;

            HttpResponseMessage response = this.PostAsJsonAsync(TokenUrl, new {
                Username = TokenUserName,
                Password = TokenPassword
            }).Result;

            if (response != null && response.IsSuccessStatusCode) {
                var stream = response.Content.ReadAsStreamAsync().Result;
                var reader = new StreamReader(stream);
                token = reader.ReadToEnd();
            }
            else if (response != null) {
                throw new HttpResponseException(response.StatusCode);
            }

            return token;
        }

        public Patient GetPatientDetail(int personId, string token) {
            Patient p = null;

            Exception taskException = null;


            var request = new UnityRequest
            {
                Action = "GETPATIENT",
                Token = token,
                Appname = "web20",
                PatientId = personId.ToString(CultureInfo.InvariantCulture)
            };
            var task = this.PostAsJsonAsync(MagicUrl, request).ContinueWith(x =>
            {
                if (x.IsCanceled)
                    return;

                if (x.IsFaulted)
                {
                    taskException = x.Exception;
                }

                var result = x.Result;
                try
                {
                    result.EnsureSuccessStatusCode();

                    Stream jsonStream = result.Content.ReadAsStreamAsync().Result;
                    var reader = new StreamReader(jsonStream);
                    var jsonSerializer = new JsonSerializer();

                    var json = jsonSerializer.Deserialize<JArray>(new JsonTextReader(reader));
                    var jsonArrayProviders = json[0];
                    foreach (var provider in jsonArrayProviders["getpatientinfo"])
                    {
                        p = new Patient();
                        p.FirstName = provider.Value<string>("Firstname");
                        p.LastName = provider.Value<string>("LastName");
                        p.UnityPersonId = int.Parse(provider.Value<string>("ID"));
                    }
                }
                catch (Exception statusException)
                {
                    taskException = statusException;
                    throw taskException;
                }
            });

            Task.WaitAll(task);

            if (taskException != null)
                throw taskException;

            return p;
        }

        public IEnumerable<Doctor> GetDoctors() {
            var doctors = new List<Doctor>();

            Exception taskException = null;

            var request = new UnityRequest {
                Action = "GETPROVIDERS",
                Token = Token,
                Appname = "web20"
            };

            var task = this.PostAsJsonAsync(MagicUrl, request).ContinueWith(x => {
                if (x.IsCanceled)
                    return;

                if (x.IsFaulted) {
                    taskException = x.Exception;
                }

                var result = x.Result;
                try {
                    result.EnsureSuccessStatusCode();

                    Stream jsonStream = result.Content.ReadAsStreamAsync().Result;
                    var reader = new StreamReader(jsonStream);
                    var jsonSerializer = new JsonSerializer();

                    var json = jsonSerializer.Deserialize<JArray>(new JsonTextReader(reader));
                    var jsonArrayProviders = json[0];
                    foreach (var provider in jsonArrayProviders["getprovidersinfo"])
                    {
                        var doctor = new Doctor();
                        doctor.FirstName = provider.Value<string>("FirstName");
                        doctor.UnityPersonId = provider.Value<int>("personid");
                        doctors.Add(doctor);
                    }
                }
                catch (Exception statusException) {
                    taskException = statusException;
                    throw taskException;
                } 
            });

            Task.WaitAll(task);

            if (taskException != null)
                throw taskException;

            return doctors;
        }


        public IEnumerable<Patient> GetPatients() {
            var patients = new List<Patient>();
            Exception taskException = null;

            string token = Token;

            var request = new UnityRequest
            {
                Action = "GETCHANGEDPATIENTS",
                Token = token,
                Appname = "web20",
                Parameter1 = "2010-01-01"
            };

            var task = this.PostAsJsonAsync(MagicUrl, request).ContinueWith(x =>
            {
                if (x.IsCanceled)
                    return;

                if (x.IsFaulted)
                {
                    taskException = x.Exception;
                }

                var result = x.Result;
                try
                {
                    result.EnsureSuccessStatusCode();

                    Stream jsonStream = result.Content.ReadAsStreamAsync().Result;
                    var reader = new StreamReader(jsonStream);
                    var jsonSerializer = new JsonSerializer();

                    var json = jsonSerializer.Deserialize<JArray>(new JsonTextReader(reader));
                    var jsonArrayProviders = json[0];
                    int index = 0;
                    foreach (var provider in jsonArrayProviders["getchangedpatientsinfo"]) {
                        if (index > 50)
                            break;
                        var patient = GetPatientDetail(int.Parse(provider.Value<string>("patientid")),
                            token);
                        patients.Add(patient);
                        ++index;
                    }
                }
                catch (Exception statusException)
                {
                    taskException = statusException;
                    throw taskException;
                }
            });

            Task.WaitAll(task);

            if (taskException != null)
                throw taskException;

            return patients;
        }
    }
}