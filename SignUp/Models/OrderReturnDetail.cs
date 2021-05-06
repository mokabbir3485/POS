using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("OrderReturnDetails")]
    public class OrderReturnDetail
    {
        [Key]
        public int OrderReturnDetailId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal MarkupPrice { get; set; }
        public int ProductQty { get; set; }
        [Column(TypeName = "Date")]
        public DateTime OrderReturnDate { get; set; }
        public int OrderReturnId { get; set; }

        public OrderReturn orderReturn { get; set; }
    }
}