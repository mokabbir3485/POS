using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("DamagedProducts")]
    public class DamagedProduct
    {
        [Key]
        public int DamagedId { get; set; }
        [Column(TypeName = "Date")]
        public DateTime DamagedDate { get; set; }
        public int TotalQuantity { get; set; }
        public decimal TotalAmount { get; set; }
        public string Description { get; set; }
    }
}