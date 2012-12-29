using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Pharmalto.Ecosystem.Models
{
    public class Medicine
    {
        public virtual int Id { get; set; }
        public virtual string Name { get; set; }
        public virtual string NdcCode { get; set; }
        public virtual string FdbId { get; set; }
        public virtual DateTime CreateDate { get; set; }
        public virtual Profile Profile { get; set; }
        public virtual MedicineType MedicineType { get; set; }
        public virtual IList<SideEffect> SideEffects { get; set; }
    }
}