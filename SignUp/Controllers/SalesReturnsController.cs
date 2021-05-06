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
    public class SalesReturnsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        [Route("api/SalesReturns/GetAllSalesReturn")]
        public IHttpActionResult GetAllSalesReturn()
        {
            var salesReturnList = db.SalesReturns.ToList();

            return Json(salesReturnList);
        }

        // GET: api/SalesReturns/5
        [Route("api/SalesReturns/GetAllSalesReturnDetail/{id}")]
        public IHttpActionResult GetAllSalesReturnDetail(int id)
        {

            var salesReturnList = db.SalesReturnDetails.ToList();
            var listitem = salesReturnList.Where(x => x.SalesReturnId == id);
            return Ok(listitem);
        }

        // POST: api/SalesReturns
        [HttpPost]
        [Route("api/SalesReturns/PostSalesReturn")]
        public IHttpActionResult PostSalesReturn(SalesReturn SalesReturn)
        {
            try
            {
                if (SalesReturn.SalesReturnId == 0)
                {
                    db.SalesReturns.Add(SalesReturn);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(SalesReturn).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + SalesReturn.SalesReturnId.ToString()), SalesReturn);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        // POST: api/SalesReturns/PostSalesReturnDetail
        [HttpPost]
        [Route("api/SalesReturns/PostSalesReturnDetail")]
        public IHttpActionResult PostSalesReturnDetail(SalesReturnDetail salesReturnDetail)
        {
            try
            {
                if (salesReturnDetail.SalesReturnDetailId == 0)
                {
                    db.SalesReturnDetails.Add(salesReturnDetail);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(salesReturnDetail).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + salesReturnDetail.SalesReturnDetailId.ToString()), salesReturnDetail);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        [HttpPost]
        [Route("api/SalesReturns/DeleteSalesReturns")]
        public IHttpActionResult DeleteSalesReturns(SalesReturn salesReturnObj)
        {

            try
            {
                SalesReturn salesReturn = db.SalesReturns.Find(salesReturnObj.SalesReturnId);
                if (salesReturn == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Sales Return with SalesReturnId= " + salesReturnObj.SalesReturnId.ToString() + " is not found"));

                }
                else
                {

                    db.SalesReturns.Remove(salesReturn);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Sales Return Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }


        [HttpPost]
        [Route("api/SalesReturns/DeleteSalesReturnDetails")]
        public IHttpActionResult DeleteSalesReturnDetails(SalesReturnDetail salesReturnDetailObj)
        {

            try
            {
                SalesReturnDetail salesReturnDetail = db.SalesReturnDetails.Find(salesReturnDetailObj.SalesReturnDetailId);
                if (salesReturnDetail == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Sales Return Detail with SalesReturnDetailId= " + salesReturnDetailObj.SalesReturnDetailId.ToString() + " is not found"));

                }
                else
                {

                    db.SalesReturnDetails.Remove(salesReturnDetail);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Sales Return Detail Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }
    }
}
