using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("SalesReturns")]
    public class SalesReturn
    {
        [Key]
        public int SalesReturnId { get; set; }
        [Column(TypeName = "Date")]
        public DateTime SalesReturnDate { get; set; }
        public int SalesReturnQuantity { get; set; }
        public decimal SalesReturnAmount { get; set; }
        public string Description { get; set; }

    }
}