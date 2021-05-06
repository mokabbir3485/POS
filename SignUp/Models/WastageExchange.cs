using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("WastageExchanges")]
    public class WastageExchange
    {
        [Key]
        public int WastageExchangeId { get; set; }
        [Column(TypeName = "Date")]
        public DateTime Date { get; set; }
        public string Brand { get; set; }
        public string Unit { get; set; }
        public string Size { get; set; }

      //  [ForeignKey("PriductId")]
        public int PriductId { get; set; }
        public Product Product { get; set; }

    //    [ForeignKey("CustomerId")]
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }

        
    }
}