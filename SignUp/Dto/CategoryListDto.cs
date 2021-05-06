using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignUp.Dto
{
    public class CategoryListDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryType { get; set; }
        public string Unit { get; set; }
        //public bool Status { get; set; }
    }
}