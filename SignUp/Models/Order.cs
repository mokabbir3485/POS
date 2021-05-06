using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("Orders")]
    public class Order
    {
        
        [Key]
        public int OrdedrId { get; set; }
        [Column(TypeName = "Date")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd HH:mm}")]
        public DateTime OrderDate { get; set; }
        public string OrderNo { get; set; }
        public int OrderQty { get; set; }
        public string OrderTotal { get; set; }
        //public bool Status { get; set; }
       
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; }
     
        //public int ProductId { get; set; }
        //public Product products { get; set; }

       

    }
}