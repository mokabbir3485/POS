using SignUp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SignUp.Controllers.Regular
{
    public class ProductsController : Controller
    {
        // GET: Products
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Create()
        {

            return View();
        }

        [HttpPost]
        public JsonResult SaveFiles(string description, int ProductId = 1)
        {
            string Message, fileName, actualFileName;
            Message = fileName = actualFileName = string.Empty;
            bool flag = false;
            if (Request.Files != null)
            {
                var file = Request.Files[0];
                actualFileName = file.FileName;
                fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                int size = file.ContentLength;

                try
                {
                    file.SaveAs(Path.Combine(Server.MapPath("~/UploadedFiles"), fileName));

                    UploadedFile f = new UploadedFile
                    {
                        FileName = actualFileName,
                        FilePath = "/UploadedFiles/" + fileName,
                        Description = description,
                        ProductId = ProductId,
                        FileSize = size
                    };
                    using (ApplicationDbContext dc = new ApplicationDbContext())
                    {
                        dc.UploadedFile.Add(f);
                        dc.SaveChanges();
                        Message = "File uploaded successfully";
                        flag = true;
                    }
                }
                catch (Exception)
                {
                    Message = "File upload failed! Please try again";
                }

            }
            return new JsonResult { Data = new { Message = Message, Status = flag } };
        }
    }
}