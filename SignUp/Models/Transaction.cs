using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("Transactions")]
    public class Transaction
    {
     
        [Key]
        public int TransactionId { get; set; }
        public string InvoiceNo { get; set; }
        //[Column(TypeName = "Date")]
        public DateTime TransactionDate { get; set; }
        public decimal SubTotal { get; set; }
        public string TransVat { get; set; }
        public string TransVatAmount { get; set; }
        public decimal TransDiscount { get; set; }
        public decimal TransDiscountAmount { get; set; }
        public int TransactionQty { get; set; }
        public decimal TotalAmount { get; set; }
        //public string TenderedAmount { get; set; }
        //public string Change { get; set; }
        public decimal Due { get; set; }

        public bool Status { get; set; }
        //public int ProductId { get; set; }
        //public Product products { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        //public Customer Customers { get; set; }
        ////
        ///Add Bank Info
        ///
        public string BankId { get; set; }
       // public BankDetail BankDetails { get; set; }
        public string BankName { get; set; }
        public string BankAccountNo { get; set; }
    }
}