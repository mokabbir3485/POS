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
    public class HomeController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpPost]
        [Route("api/Home/getExpenseDetails")]
        public IHttpActionResult getExpenseDetails(Home home)
        {
            try
            {

                var results = db.Expenses.Where(x => x.ExpenseDate >= home.startdate && x.ExpenseDate <= home.enddate).ToList();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        [HttpPost]
        [Route("api/Home/getTransactionDetails")]
        public IHttpActionResult getTransactionDetails(Home home)
        {
            try
            {

                var results = db.Transactions.Where(x => x.TransactionDate >= home.startdate && x.TransactionDate <= home.enddate).ToList();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }
        }
    }
}
