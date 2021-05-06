using SignUp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SignUp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class DamagedProductsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [HttpGet]
        [Route("api/DamagedProducts/GetAllDamagedProduct")]
        public IHttpActionResult GetAllDamagedProduct()
        {
            var damagedProductList = db.damagedProducts.ToList();
            
            return Json(damagedProductList);
        }
        [Route("api/DamagedProducts/GetAllDamagedProductDetail/{id}")]
        public IHttpActionResult GetAllDamagedProductDetail(int id)
        {

            var DamagedProductDetailList = db.DamagedProductDetails.ToList();
            var listitem = DamagedProductDetailList.Where(x => x.DamagedId == id);
            return Ok(listitem);
        }

        [HttpPost]
        [Route("api/DamagedProducts/PostDamagedProduct")]
        public IHttpActionResult PostDamagedProduct(DamagedProduct DamagedProduct)
        {
            try
            {
                if (DamagedProduct.DamagedId == 0)
                {
                    db.damagedProducts.Add(DamagedProduct);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(DamagedProduct).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + DamagedProduct.DamagedId.ToString()), DamagedProduct);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        // POST: api/DamagedProducts/PostDamagedProductDetail
        [HttpPost]
        [Route("api/DamagedProducts/PostDamagedProductDetail")]
        public IHttpActionResult PostDamagedProductDetail(DamagedProductDetail DamagedProductDetail)
        {
            try
            {
                if (DamagedProductDetail.DamagedProductDetailId == 0)
                {
                    db.DamagedProductDetails.Add(DamagedProductDetail);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(DamagedProductDetail).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + DamagedProductDetail.DamagedProductDetailId.ToString()), DamagedProductDetail);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        [HttpPost]
        [Route("api/DamagedProducts/DeleteDamagedProductDetail")]
        public IHttpActionResult DeleteDamagedProductDetail(DamagedProductDetail DamagedProductDetailObj)
        {

            try
            {
                DamagedProductDetail DamagedProductDetail = db.DamagedProductDetails.Find(DamagedProductDetailObj.DamagedProductDetailId);
                if (DamagedProductDetail == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "DamagedProductDetail with DamagedProductDetailId= " + DamagedProductDetailObj.DamagedProductDetailId.ToString() + " is not found"));

                }
                else
                {

                    db.DamagedProductDetails.Remove(DamagedProductDetail);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "DamagedProductDetail Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        [HttpPost]
        [Route("api/DamagedProducts/DeleteDamagedProducts")]
        public IHttpActionResult DeleteDamagedProducts(DamagedProduct DamagedProductObj)
        {

            try
            {
                DamagedProduct DamagedProduct = db.damagedProducts.Find(DamagedProductObj.DamagedId);
                if (DamagedProduct == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "DamagedProduct with DamagedId= " + DamagedProductObj.DamagedId.ToString() + " is not found"));

                }
                else
                {

                    db.damagedProducts.Remove(DamagedProduct);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "DamagedProduct Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

    }
}
