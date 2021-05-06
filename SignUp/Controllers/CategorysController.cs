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
    public class CategorysController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        [Route("api/Categorys/AllCategorys")]
        public HttpResponseMessage AllCategorys()
        {
            var categoryList = db.Categorys.Select(category => new CategoryListDto()

            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                CategoryType = category.CategoryType,
                Unit = category.Unit,
                //Status = category.Status
            });
            var categoryDisList = categoryList.OrderByDescending(c => c.CategoryId);

            return Request.CreateResponse(HttpStatusCode.OK, categoryDisList);
        }

        // GET: api/Categorys/5
        [ResponseType(typeof(Category))]
        public IHttpActionResult GetCategory(int id)
        {
            Category category = db.Categorys.Find(id);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        
        [HttpPost]
        [Route("api/Categorys/CreateCategory")]
        [ResponseType(typeof(Category))]
        public IHttpActionResult CreateCategory(Category category)
        {
            try
            {
                db.Categorys.Add(category);
                db.SaveChanges();
                return Created(new Uri(Request.RequestUri + category.CategoryId.ToString()), category);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }

        }
        [HttpPut]
        [Route("api/Categorys/UpdateCategory/{id}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateCategory([FromUri]int id, [FromBody]Category category)
        {
            try
            {
                Category categoryEntity = db.Categorys.Find(id);
                if (categoryEntity == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Category with CategorysId= " + id.ToString() + " is not found"));

                }
                else
                {

                    categoryEntity.CategoryName = category.CategoryName;
                    categoryEntity.CategoryType = category.CategoryType;
                    categoryEntity.Unit = category.Unit;
                    //categoryEntity.Status = category.Status;
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, categoryEntity));
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        // DELETE: api/Categorys/5
        //[ResponseType(typeof(Category))]
        //public IHttpActionResult DeleteCategory(int id)
        //{
        //    Category category = db.Categorys.Find(id);
        //    if (category == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Categorys.Remove(category);
        //    db.SaveChanges();

        //    return Ok(category);
        //}
        [HttpPost]
        [Route("api/Categorys/DeleteCategory")]
        [ResponseType(typeof(Category))]
        public IHttpActionResult DeleteCategory(Category categoryObj)
        {
            try
            {
                Category category = db.Categorys.Find(categoryObj.CategoryId);
                if (category == null)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Category with CategoryId= " + categoryObj.CategoryId.ToString() + " is not found"));
                }
                else
                {
                    db.Categorys.Remove(category);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Category Deleted"));
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

        private bool CategoryExists(int id)
        {
            return db.Categorys.Count(e => e.CategoryId == id) > 0;
        }
    }
}