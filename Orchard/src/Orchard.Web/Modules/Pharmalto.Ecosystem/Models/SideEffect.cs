using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Pharmalto.Ecosystem.Models
{
    public class SideEffect
    {
        public virtual int Id { get; set; }
        public virtual DateTime IncidentDate { get; set; }
        public virtual DateTime CreateDate { get; set; }
        public virtual string Notes { get; set; }

        public virtual Medicine Medicine { get; set; }
    }
}