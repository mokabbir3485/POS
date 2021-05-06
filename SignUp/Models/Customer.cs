using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("Customers")]
    public class Customer
    {
        //public Customer()
        //{
        //    this.Transactions = new List<Transaction>();
        //}
        [Key]
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; } 
        public string CustomerPhone { get; set; }
        public decimal Due { get; set; }
        //public bool Status { get; set; }

        //public List<Transaction> Transactions { get; set; }
    }
}