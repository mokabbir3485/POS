using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("TransactionDetails")]
    public class TransactionDetail
    {
        [Key]
        public int TransactionDetailId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal MarkupPrice { get; set; }
        public int ProductQty { get; set; }
        public int TransactionId { get; set; }
        [Column(TypeName = "Date")]
        public DateTime TransactionDate { get; set; }

        public Transaction transactions { get; set; }
    }
}