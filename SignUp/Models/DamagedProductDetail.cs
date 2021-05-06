using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("DamagedProductDetails")]
    public class DamagedProductDetail
    {
        [Key]
        public int DamagedProductDetailId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }  
        public decimal OriginalPrice { get; set; }
        public decimal MarkupPrice { get; set; }
        public int ProductQty { get; set; }

        public int DamagedId { get; set; }
        //[NotMapped]
       public DamagedProduct damagedProducts { get; set; }

    }
}