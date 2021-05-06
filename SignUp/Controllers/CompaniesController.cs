using SignUp.Dto;
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
    public class CompaniesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        [Route("api/Companies/AllCompanies")]
        public HttpResponseMessage AllCompanies()
        {
            var companyList = db.Companies.Select(company => new CompanyListDto()
            {
                CompanyId = company.CompanyId,
                CompanyName = company.CompanyName,
                CompanyAddress = company.CompanyAddress,
                FactoryAddress = company.FactoryAddress,
                BusinessType = company.BusinessType,
                //Status = company.Status
            });
            var companyDisList = companyList.OrderByDescending(c => c.CompanyId);

            return Request.CreateResponse(HttpStatusCode.OK, companyDisList);
        }

        // GET: api/Companies/5
        [ResponseType(typeof(Company))]
        public IHttpActionResult GetCompany(int id)
        {
            Company company = db.Companies.Find(id);
            if (company == null)
            {
                return NotFound();
            }

            return Ok(company);
        }

        // PUT: api/Companies/5
        [HttpPut]
        [Route("api/Companies/UpdateCompany/{id}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateCompany([FromUri]int id, [FromBody]Company company)
        {
            try
            {
                Company companyEntity = db.Companies.Find(id);
                if (companyEntity == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Company with CompanyId= " + id.ToString() + " is not found"));

                }
                else
                {

                    companyEntity.CompanyName = company.CompanyName;
                    companyEntity.CompanyAddress = company.CompanyAddress;
                    companyEntity.FactoryAddress = company.FactoryAddress;
                    companyEntity.BusinessType = company.BusinessType;
                    //companyEntity.Status = company.Status;
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, companyEntity));
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        // POST: api/Companies

        [HttpPost]
        [Route("api/Companies/CreateCompany")]
        [ResponseType(typeof(Company))]
        public IHttpActionResult CreateCompany(Company company)
        {
            try
            {
                db.Companies.Add(company);
                db.SaveChanges();
                return Created(new Uri(Request.RequestUri + company.CompanyId.ToString()), company);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }

        }

        // DELETE: api/Companies/5
        [HttpPost]
        [Route("api/Companies/DeleteCompany")]
        [ResponseType(typeof(Company))]
        public IHttpActionResult DeleteCompany(Company companyObj)
        {
            try
            {
                Company company = db.Companies.Find(companyObj.CompanyId);
                if (company == null)
                {
                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Company with CompanyId= " + companyObj.CompanyId.ToString() + " is not found"));
                }
                else
                {
                    db.Companies.Remove(company);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Company Deleted"));
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

        private bool CompanyExists(int id)
        {
            return db.Companies.Count(e => e.CompanyId == id) > 0;
        }
    }
}
