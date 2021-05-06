using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("Categorys")]
    public class Category
    {
        public Category()
        {
            this.Products = new List<Product>();
        }
        [Key]
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryType { get; set; }
        public string Unit { get; set; }
        //public bool Status { get; set; }
        public List<Product> Products { get; set; }
    }
}