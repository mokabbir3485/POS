using SignUp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace SignUp.Controllerss
{
    [Authorize(Roles = "Admin")]
    public class ProductsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [HttpGet]
        [Route("api/Products/GetAllProduct")]
        public IHttpActionResult GetAllProduct()
        {

            var productList = db.Products.ToList();
            var categoryList = db.Categorys.ToList();
            var TotalList = from c in categoryList
                            join p in productList on c.CategoryId equals p.CategoryId
                            select new
                            {
                                c.CategoryName,
                                c.CategoryType,
                                p.CategoryId,
                                p.Description,
                                p.MarkupPrice,
                                p.ProductName,
                                p.ProductNo,
                                p.ProductQty,
                                //p.Status,
                                p.OriginalPrice,
                                p.ProductId
                            };
            //var listObj = db.Products.ToList();
            //List<Product> products = new List<Product>();

            //foreach (var item in listObj)
            //{
            //    products.Add(new Product
            //    {
            //        CateName=item.Categorys.CategoryName,
            //        Description=item.Description,
            //        MarkupPrice=item.MarkupPrice,
            //        ProductNo=item.ProductNo,
            //        ProductName=item.ProductName,
            //        OriginalPrice=item.OriginalPrice,
            //        ProductId=item.ProductId,
            //        Status=item.Status,

            //    });
            //}

            return Json(TotalList);
        }
        // GET: api/Categorys
        [HttpGet]
        [Route("api/Products/GetCategorys")]
        public IQueryable<Category> GetCategorys()
        {
            return db.Categorys;
        }

        // GET: api/Categorys/5
        [ResponseType(typeof(Category))]
        public IHttpActionResult GetCategory(int id)
        {
            Category category = db.Categorys.Find(id);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }


        // POST: api/Products
        [HttpPost]
        [Route("api/Products/PostProduct")]
        public IHttpActionResult PostProduct(List<Product> product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // product.CategoryId = 2;


            foreach (var item in product)
            {
                if (item.ProductId == 0)
                {
                    db.Products.Add(item);
                    db.SaveChanges();
                }
                else
                {

                    db.Entry(item).State = EntityState.Modified;
                    db.SaveChanges();
                    // db.Products.AddOrUpdate(item);
                }


            }


            return CreatedAtRoute("DefaultApi", new { product }, product);
        }
        [HttpPost]
        //[Route("/api/Categorys/DeleteProducts/{id}")]
        [Route("api/Products/DeleteProducts")]
        public IHttpActionResult DeleteProducts(Product productObj)
        {

            try
            {
                Product product = db.Products.Find(productObj.ProductId);
                if (product == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Product with ProductId= " + productObj.ProductId.ToString() + " is not found"));

                }
                else
                {

                    db.Products.Remove(product);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Product Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        [Route("api/Products/GetAllTransactionDetail")]
        public IHttpActionResult GetAllTransactionDetail()
        {

            var transactionList = db.TransactionDetails.ToList();
            //var listitem = transactionList.Where(x => x.TransactionId == id);
            return Ok(transactionList);
        }

        [Route("api/Products/GetAllOrderDetail")]
        public IHttpActionResult GetAllOrderDetail()
        {

            var orderList = db.OrderDetails.ToList();
            //var listitem = orderList.Where(x => x.OrdedrId == id);
            return Ok(orderList);
        }
        [Route("api/Products/GetAllOrderReturnDetail")]
        public IHttpActionResult GetAllOrderReturnDetail()
        {

            var orderReturnList = db.OrderReturnDetails.ToList();
            //var listitem = orderReturnList.Where(x => x.OrderReturnId == id);
            return Ok(orderReturnList);
        }
        [Route("api/Products/GetAllSalesReturnDetail")]
        public IHttpActionResult GetAllSalesReturnDetail()
        {

            var salesReturnList = db.SalesReturnDetails.ToList();
            //var listitem = salesReturnList.Where(x => x.SalesReturnId == id);
            return Ok(salesReturnList);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }




    }
}
