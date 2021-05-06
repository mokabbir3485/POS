using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("Suppliers")]
    public class Supplier
    {

        [Key]
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