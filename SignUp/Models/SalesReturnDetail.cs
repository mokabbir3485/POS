using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("SalesReturnDetails")]
    public class SalesReturnDetail
    {
        [Key]
        public int SalesReturnDetailId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal MarkupPrice { get; set; }
        public int ProductQty { get; set; }
        [Column(TypeName = "Date")]
        public DateTime SalesReturnDate { get; set; }
        public int SalesReturnId { get; set; }

        public SalesReturn salesReturn { get; set; }
    }
}