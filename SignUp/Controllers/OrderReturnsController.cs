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
    public class OrderReturnsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        [Route("api/OrderReturns/GetAllOrderReturn")]
        public IHttpActionResult GetAllOrderReturn()
        {
            var orderReturnList = db.OrderReturns.ToList();
            
            return Json(orderReturnList);
        }

        // GET: api/OrderReturns/5
        [Route("api/OrderReturns/GetAllOrderReturnDetail/{id}")]
        public IHttpActionResult GetAllOrderReturnDetail(int id)
        {

            var orderReturnList = db.OrderReturnDetails.ToList();
            var listitem = orderReturnList.Where(x => x.OrderReturnId == id);
            return Ok(listitem);
        }

        // POST: api/OrderReturns
        [HttpPost]
        [Route("api/OrderReturns/PostOrderReturn")]
        public IHttpActionResult PostOrderReturn(OrderReturn OrderReturn)
        {
            try
            {
                if (OrderReturn.OrderReturnId == 0)
                {
                    db.OrderReturns.Add(OrderReturn);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(OrderReturn).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + OrderReturn.OrderReturnId.ToString()), OrderReturn);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        // POST: api/OrderReturns/PostOrderReturnDetail
        [HttpPost]
        [Route("api/OrderReturns/PostOrderReturnDetail")]
        public IHttpActionResult PostOrderReturnDetail(OrderReturnDetail orderReturnDetail)
        {
            try
            {
                if (orderReturnDetail.OrderReturnDetailId == 0)
                {
                    db.OrderReturnDetails.Add(orderReturnDetail);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(orderReturnDetail).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + orderReturnDetail.OrderReturnDetailId.ToString()), orderReturnDetail);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        [HttpPost]
        [Route("api/OrderReturns/DeleteOrderReturns")]
        public IHttpActionResult DeleteOrderReturns(OrderReturn orderReturnObj)
        {

            try
            {
                OrderReturn orderReturn = db.OrderReturns.Find(orderReturnObj.OrderReturnId);
                if (orderReturn == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "OrderReturn with OrderReturnId= " + orderReturnObj.OrderReturnId.ToString() + " is not found"));

                }
                else
                {

                    db.OrderReturns.Remove(orderReturn);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "OrderReturn Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }


        [HttpPost]
        [Route("api/OrderReturns/DeleteOrderReturnDetails")]
        public IHttpActionResult DeleteOrderReturnDetails(OrderReturnDetail orderReturnDetailObj)
        {

            try
            {
                OrderReturnDetail orderReturnDetail = db.OrderReturnDetails.Find(orderReturnDetailObj.OrderReturnDetailId);
                if (orderReturnDetail == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "OrderReturnDetail with OrderReturnDetailId= " + orderReturnDetailObj.OrderReturnDetailId.ToString() + " is not found"));

                }
                else
                {

                    db.OrderReturnDetails.Remove(orderReturnDetail);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "OrderReturnDetail Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }
    }
}
