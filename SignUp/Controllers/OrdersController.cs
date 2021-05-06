using SignUp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace SignUp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class OrdersController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        [Route("api/Orders/GetAllOrder")]
        public IHttpActionResult GetAllOrder()
        {

            var productList = db.Products.ToList();
            var supplierList = db.Suppliers.ToList();
            var orderList = db.Orders.ToList();
            var TotalList = from o in orderList
                            join s in supplierList  on o.SupplierId equals s.SupplierId
                            select new
                            {
                                o.OrdedrId,
                                o.OrderDate,
                                o.OrderNo,
                                o.OrderQty,
                                o.OrderTotal,
                                //o.Status,
                                s.SupplierId,
                                s.SupplierName
                                
                                
                            };
                            //var TotalList = from o in orderList
                            //join s in supplierList  on o.SupplierId equals s.SupplierId
                            //join p in productList on o.ProductId equals p.ProductId
                            //select new
                            //{
                            //    o.OrdedrId,
                            //    o.OrderDate,
                            //    o.OrderNo,
                            //    o.OrderQty,
                            //    o.OrderTotal,
                            //    o.Status,
                            //    s.SupplierId,
                            //    s.SupplierName,
                            //    p.ProductId,
                            //    p.ProductName
                                
                            //};

            return Json(TotalList);
        }

        // GET: api/Orders/5
        [Route("api/Orders/GetAllOrderDetail/{id}")]
        public IHttpActionResult GetAllOrderDetail(int id)
        {

            var orderList = db.OrderDetails.ToList();
            var listitem= orderList.Where(x => x.OrdedrId == id);
            return Ok(listitem);
        }

        // POST: api/Orders
        [HttpPost]
        [Route("api/Orders/PostOrder")]
        public IHttpActionResult PostOrder(Order Order)
        {
            try
            {
                if (Order.OrdedrId == 0)
                {
                    db.Orders.Add(Order);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(Order).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + Order.OrdedrId.ToString()), Order);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        // POST: api/Orders/PostOrderDetail
        [HttpPost]
        [Route("api/Orders/PostOrderDetail")]
        public IHttpActionResult PostOrderDetail(OrderDetail orderDetail)
        {
            try
            {
                if (orderDetail.OrderDetailId == 0)
                {
                    db.OrderDetails.Add(orderDetail);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(orderDetail).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + orderDetail.OrderDetailId.ToString()), orderDetail);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        [HttpPost]
        [Route("api/Orders/DeleteOrders")]
        public IHttpActionResult DeleteOrders(Order orderObj)
        {

            try
            {
                Order order = db.Orders.Find(orderObj.OrdedrId);
                if (order == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Order with OrdedrId= " + orderObj.OrdedrId.ToString() + " is not found"));

                }
                else
                {

                    db.Orders.Remove(order);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Order Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }


        [HttpPost]
        [Route("api/Orders/DeleteOrderDetails")]
        public IHttpActionResult DeleteOrderDetails(OrderDetail orderDetailObj)
        {

            try
            {
                OrderDetail orderDetail = db.OrderDetails.Find(orderDetailObj.OrderDetailId);
                if (orderDetail == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "OrderDetail with OrderDetailId= " + orderDetailObj.OrderDetailId.ToString() + " is not found"));

                }
                else
                {

                    db.OrderDetails.Remove(orderDetail);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "OrderDetail Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

    }
}
