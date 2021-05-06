using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public string ProductNo { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal MarkupPrice { get; set; }
        public int ProductQty { get; set; }
        ///public bool Status { get; set; }
        public int ? CategoryId { get; set; }
        
        public Category Category { get; set; }
        
    }
}