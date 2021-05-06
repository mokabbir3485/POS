using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("Stockins")]
    public class Stockin
    {
        [Key]
        public int StockinId { get; set; }
        public string StockinNo { get; set; }
        [Column(TypeName = "Date")]
        public DateTime DateReceived { get; set; }
        //public decimal Price { get; set; }
        public int Qty { get; set; }
        public decimal TotalAmount { get; set; }
        //public bool Status { get; set; }
       // [ForeignKey("UserId")]
        //public int UserId { get; set; }
       /// [ForeignKey("OrderId")]
        public int OrderId { get; set; }
        public string OrderNo { get; set; }
        //public Order Orders { get; set; }
        //public int OrderDetailId { get; set; }
        //public OrderDetail OrderDetails { get; set; }

    }
}