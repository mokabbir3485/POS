using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignUp.Dto
{
    public class SupplierListDto
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string ContactNo { get; set; }
        public string Company { get; set; }
        public int CompanyId { get; set; }
        public string CompanyAddress { get; set; }
        public string FactoryAddress { get; set; }
        //public bool Status { get; set; }
    }
}