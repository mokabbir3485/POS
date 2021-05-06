using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignUp.Dto
{
    public class CompanyListDto
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string FactoryAddress { get; set; }
        public string BusinessType { get; set; }
        //public bool Status { get; set; }
    }
}