using SignUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace SignUp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ExpensesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Expenses

        [HttpGet]
        [Route("api/Expenses/AllExpenses")]
        public HttpResponseMessage AllExpenses()
        {
            var expenseList = db.Expenses.ToList();
            var expenseDisList = expenseList.OrderByDescending(b => b.ExpenseId);
            return Request.CreateResponse(HttpStatusCode.OK, expenseDisList);
        }

        // POST: api/Expenses
        [HttpPost]
        [Route("api/Expenses/CreateExpense")]
        [ResponseType(typeof(Expense))]
        public IHttpActionResult CreateExpense(Expense expense)
        {
            expense.UpdatedDate = System.DateTime.Now;
            try
            {
                db.Expenses.Add(expense);
                db.SaveChanges();
                return Created(new Uri(Request.RequestUri + expense.ExpenseId.ToString()), expense);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }

        }
        [HttpPut]
        [Route("api/Expenses/UpdateExpense/{id}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateExpense([FromUri]int id, [FromBody]Expense expense)
        {
            try
            {
                expense.UpdatedDate = System.DateTime.Now;
                Expense expenseEntity = db.Expenses.Find(id);
                if (expenseEntity == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Expense with ExpenseId= " + id.ToString() + " is not found"));

                }
                else
                {

                    expenseEntity.ExpenseType = expense.ExpenseType;
                    expenseEntity.OrdedrId = expense.OrdedrId;
                    expenseEntity.OrderNo = expense.OrderNo;
                    expenseEntity.ExpenseDate = expense.ExpenseDate;
                    expenseEntity.Description = expense.Description;
                    expenseEntity.Amount = expense.Amount;
                    expenseEntity.UpdatedDate = expense.UpdatedDate;
                    //expenseEntity.Status = expense.Status;
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, expenseEntity));
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }
        [HttpPost]
        [Route("api/Expenses/DeleteExpense")]
        [ResponseType(typeof(Expense))]
        public IHttpActionResult DeleteExpense(Expense expenseObj)
        {

            try
            {
                Expense expense = db.Expenses.Find(expenseObj.ExpenseId);
                if (expense == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Expense with SupplierId= " + expenseObj.ExpenseId.ToString() + " is not found"));

                }
                else
                {

                    db.Expenses.Remove(expense);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Expense Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }
    }
}
