using SignUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SignUp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class IncomesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        [Route("api/Incomes/GetAllTIncome")]
        public IHttpActionResult GetAllTIncome()
        {

            var productList = db.Products.ToList();
            var customerList = db.Customers.ToList();
            var transactionList = db.Transactions.ToList();
            var TotalList = from t in transactionList
                            join c in customerList on t.CustomerId equals c.CustomerId
                            select new
                            {
                                t.TransactionId,
                                t.TransactionDate,
                                t.InvoiceNo,
                                t.TransactionQty,
                                t.SubTotal,
                                t.TransVat,
                                t.TransVatAmount,
                                t.TransDiscount,
                                t.TransDiscountAmount,
                                t.TotalAmount,
                                t.Due,
                                //t.Status,
                                c.CustomerId,
                                c.CustomerName

                            };

            return Json(TotalList);
        }

    }
}
