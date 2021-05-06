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
    [Authorize(Roles ="Admin")]
    public class BankDetailsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/BankDetails
        
        [HttpGet]
        [Route("api/BankDetails/AllBankDetails")]
        public HttpResponseMessage AllBankDetails()
        {
            var customers = db.Customers.ToList();
            var companies = db.Companies.ToList();
            var bankDetailList = db.BankDetails.ToList(); 
            //var bankDetailList = from bank in bankDetails 
            //                join comp in companies on bank.CompanyId equals comp.CompanyId
            //                join cust in customers on bank.CustomerId equals cust.CustomerId
            //                select new
            //                {
            //                    bank.BankId,
            //                    bank.BankName,
            //                    bank.BankAccountNo,
            //                    bank.BankAccountType,
            //                    bank.AccountFor,
            //                    bank.CustomerId,
            //                    bank.CompanyId,
            //                    comp.CompanyName,
            //                    cust.CustomerName,
            //                    bank.Status
            //                };
           
            var bankDetailDisList = bankDetailList.OrderByDescending(b => b.BankId);
            return Request.CreateResponse(HttpStatusCode.OK, bankDetailDisList);
        }

        // GET: api/BankDetails/5
        [ResponseType(typeof(BankDetail))]
        public IHttpActionResult GetBankDetail(int id)
        {
            BankDetail bankDetail = db.BankDetails.Find(id);
            if (bankDetail == null)
            {
                return NotFound();
            }

            return Ok(bankDetail);
        }


        // POST: api/BankDetails
        [HttpPost]
        [Route("api/BankDetails/CreateBankDetail")]
        [ResponseType(typeof(BankDetail))]
        public IHttpActionResult CreateBankDetail(BankDetail bankDetail)
        {
            try
            {
                db.BankDetails.Add(bankDetail);
                db.SaveChanges();
                return Created(new Uri(Request.RequestUri + bankDetail.BankId.ToString()), bankDetail);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }

        }
        [HttpPut]
        [Route("api/BankDetails/UpdateBankDetail/{id}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateBankDetail([FromUri]int id, [FromBody]BankDetail bankDetail)
        {
            try
            {
                BankDetail bankDetailEntity = db.BankDetails.Find(id);
                if (bankDetailEntity == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Bank Detail with BankId= " + id.ToString() + " is not found"));

                }
                else
                {

                    bankDetailEntity.BankName = bankDetail.BankName;
                    bankDetailEntity.BankAccountNo = bankDetail.BankAccountNo;
                    bankDetailEntity.BankAccountType = bankDetail.BankAccountType;
                    bankDetailEntity.AccountFor = bankDetail.AccountFor; 
                    //bankDetailEntity.CustomerId = bankDetail.CustomerId;
                    //bankDetailEntity.CompanyId = bankDetail.CompanyId;
                    //bankDetailEntity.Status = bankDetail.Status;
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, bankDetailEntity));
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        [HttpPost]
        [Route("api/BankDetails/DeleteBankDetail")]
        [ResponseType(typeof(BankDetail))]
        public IHttpActionResult DeleteBankDetail(BankDetail bankDetailObj)
        {
            try
            {
                BankDetail bankDetail = db.BankDetails.Find(bankDetailObj.BankId);
                if (bankDetail == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Bank Detail with BankId= " + bankDetailObj.BankId.ToString() + " is not found"));
                }
                else
                {
                    db.BankDetails.Remove(bankDetail);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Bank Detail Deleted"));
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

        private bool BankDetailExists(int id)
        {
            return db.BankDetails.Count(e => e.BankId == id) > 0;
        }
    }
}