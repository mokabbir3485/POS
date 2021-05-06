using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("Summarys")]
    public class Summary
    {
        [Key]
        public int SummaryId { get; set; }
        public string PaymentType { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AmountTendered { get; set; }
        public decimal Change { get; set; }
        //public bool Status { get; set; }
        public int TransactionId { get; set; }
        public Transaction  transactions { get; set; }

        public int BankDetailId { get; set; }
        public BankDetail bankDetails { get; set; }
    }
}