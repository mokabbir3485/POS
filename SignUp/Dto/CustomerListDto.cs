using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignUp.Dto
{
    public class CustomerListDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; } 
        public string CustomerPhone { get; set; }
        public decimal Due { get; set; }
        //public bool Status { get; set; }
    }
}