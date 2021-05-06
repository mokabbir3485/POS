using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SignUp.Dto;
using SignUp.Models;

namespace SignUp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CustomersController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Customers
        //public IQueryable<Customer> GetCustomers()
        //{
        //    return db.Customers;
        //}
        [HttpGet]
        [Route("api/Customers/AllCustomers")]
        public HttpResponseMessage AllCustomers()
        {
            var customerList = db.Customers.Select(customer => new CustomerListDto()

            {
                CustomerId = customer.CustomerId,
                CustomerName = customer.CustomerName,
                CustomerAddress = customer.CustomerAddress,
                CustomerPhone = customer.CustomerPhone,
                Due = customer.Due,
                //Status = customer.Status
            });
            var customerDisList = customerList.OrderByDescending(c => c.CustomerId);

            return Request.CreateResponse(HttpStatusCode.OK, customerDisList);
        }


        // GET: api/Customers/5
        [ResponseType(typeof(Customer))]
        public IHttpActionResult GetCustomer(int id)
        {
            Customer customer = db.Customers.Find(id);
            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        // PUT: api/Customers/5
        [HttpPut]
        [Route("api/Customers/UpdateCustomer/{id}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateCustomer([FromUri]int id, [FromBody]Customer customer)
        {
            try
            {
                Customer customerEntity = db.Customers.Find(id);
                if (customerEntity == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Customer with CustomerId= " + id.ToString() + " is not found"));

                }
                else
                {

                    customerEntity.CustomerName = customer.CustomerName;
                    customerEntity.CustomerAddress = customer.CustomerAddress;
                    customerEntity.CustomerPhone = customer.CustomerPhone;
                    customerEntity.Due = customer.Due;
                    //customerEntity.Status = customer.Status;
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, customerEntity));
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        // POST: api/Customers

        [HttpPost]
        [Route("api/Customers/CreateCustomer")]
        [ResponseType(typeof(Customer))]
        public IHttpActionResult CreateCustomer(Customer customer)
        {
            try
            {
                db.Customers.Add(customer);
                db.SaveChanges();
                return Created(new Uri(Request.RequestUri + customer.CustomerId.ToString()), customer);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }

        }

        // DELETE: api/Customers/5
        [HttpPost]
        [Route("api/Customers/DeleteCustomer")]
        [ResponseType(typeof(Customer))]
        public IHttpActionResult DeleteCustomer(Customer customerObj)
        {
            try
            {
                Customer customer = db.Customers.Find(customerObj.CustomerId);
                if (customer == null)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Customer with CustomerId= " + customerObj.CustomerId.ToString() + " is not found"));
                }
                else
                {
                    db.Customers.Remove(customer);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Customer Deleted"));
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CustomerExists(int id)
        {
            return db.Customers.Count(e => e.CustomerId == id) > 0;
        }
    }
}