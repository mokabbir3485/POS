using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SignUp.Models
{
    [Table("UploadedFile")]
    public class UploadedFile
    {
        [Key]
        public int FileID { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Description { get; set; }
        public int FileSize { get; set; }
        public int? ProductId { get; set; }
        public Product Product { get; set; }
    }
}