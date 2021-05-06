using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("OrderReturns")]
    public class OrderReturn
    {
        [Key]
        public int OrderReturnId { get; set; }
        [Column(TypeName = "Date")]
        public DateTime OrderReturnDate { get; set; }
        public int OrderReturnQuantity { get; set; }
        public decimal OrderReturnAmmount { get; set; }
        public string Description { get; set; }


        
    }
}