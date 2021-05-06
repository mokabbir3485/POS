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
    public class TransactionsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        [Route("api/Transactions/GetAllTransaction")]
        public IHttpActionResult GetAllTransaction()
        {

            var productList = db.Products.ToList();
            var customerList = db.Customers.ToList();
            var transactionList = db.Transactions.ToList();
            //var TotalList = from t in transactionList
            //                join c in customerList on t.CustomerId equals c.CustomerId
            //                select new
            //                {
            //                    t.TransactionId,
            //                    t.TransactionDate,
            //                    t.InvoiceNo,
            //                    t.TransactionQty,
            //                    t.SubTotal,
            //                    t.TransVat,
            //                    t.TransVatAmount,
            //                    t.TransDiscount,
            //                    t.TransDiscountAmount,
            //                    t.TotalAmount,
            //                    t.Due,
            //                    t.BankId,
            //                    t.BankName,
            //                    t.BankAccountNo,
            //                    c.CustomerId,
            //                    c.CustomerName

            //                };

            return Json(transactionList);
        }

        [Route("api/Transactions/GetAllTransactionDetail/{id}")]
        public IHttpActionResult GetAllTransactionDetail(int id)
        {

            var transactionList = db.TransactionDetails.ToList();
            var listitem = transactionList.Where(x => x.TransactionId == id);
            return Ok(listitem);
        }
        [HttpPost]
        [Route("api/Transactions/PostTransaction")]
        public IHttpActionResult PostTransaction(Transaction Transaction)
        {
            try
            {
                if (Transaction.TransactionId == 0)
                {
                    db.Transactions.Add(Transaction);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(Transaction).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + Transaction.TransactionId.ToString()), Transaction);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        // POST: api/Transactions/PostTransactionDetail
        [HttpPost]
        [Route("api/Transactions/PostTransactionDetail")]
        public IHttpActionResult PostTransactionDetail(TransactionDetail TransactionDetail)
        {
            try
            {
                if (TransactionDetail.TransactionDetailId == 0)
                {
                    db.TransactionDetails.Add(TransactionDetail);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(TransactionDetail).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Created(new Uri(Request.RequestUri + TransactionDetail.TransactionDetailId.ToString()), TransactionDetail);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        [HttpPost]
        [Route("api/Transactions/DeleteTransactions")]
        public IHttpActionResult DeleteTransactions(Transaction transactionObj)
        {

            try
            {
                Transaction transaction = db.Transactions.Find(transactionObj.TransactionId);
                if (transaction == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Transaction with TransactionId= " + transactionObj.TransactionId.ToString() + " is not found"));

                }
                else
                {

                    db.Transactions.Remove(transaction);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Transaction Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        [HttpPost]
        [Route("api/Transactions/DeleteTransactionDetails")]
        public IHttpActionResult DeleteTransactionDetails(TransactionDetail transactionDetailObj)
        {

            try
            {
                TransactionDetail transactionDetail = db.TransactionDetails.Find(transactionDetailObj.TransactionDetailId);
                if (transactionDetail == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "TransactionDetail with TransactionDetailId= " + transactionDetailObj.TransactionDetailId.ToString() + " is not found"));

                }
                else
                {

                    db.TransactionDetails.Remove(transactionDetail);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "TransactionDetail Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }
    }
}
