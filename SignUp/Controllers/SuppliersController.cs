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
    public class SuppliersController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        [Route("api/Suppliers/AllSuppliers")]
        public HttpResponseMessage AllSuppliers()
        {
            var supplierList = db.Suppliers.Select(supplier => new SupplierListDto()

            {
                SupplierId = supplier.SupplierId,
                SupplierName = supplier.SupplierName,
                ContactNo = supplier.ContactNo,
                Company = supplier.Company,
                CompanyId = supplier.CompanyId,
                CompanyAddress = supplier.CompanyAddress,
                FactoryAddress = supplier.FactoryAddress,
                //Status = supplier.Status
            });
            var supplierDisList = supplierList.OrderByDescending(s => s.SupplierId);

            return Request.CreateResponse(HttpStatusCode.OK, supplierDisList);
        }
        [HttpGet]
        [Route("api/Suppliers/GetSupplier/{id}")]
        [ResponseType(typeof(Supplier))]
        public HttpResponseMessage GetSupplier(int id)
        {
            var supplierObj = db.Suppliers.Find(id);
            if (supplierObj == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "The data is not found");
            }
            var supplierOne = db.Suppliers.Select(supplier => new SupplierListDto()
            {
                SupplierId = supplier.SupplierId,
                SupplierName = supplier.SupplierName,
                ContactNo = supplier.ContactNo,
                Company = supplier.Company,
                CompanyId = supplier.CompanyId,
                CompanyAddress = supplier.CompanyAddress,
                FactoryAddress = supplier.FactoryAddress,
                //Status = supplier.Status
            }).SingleOrDefault(d => d.SupplierId == id);



            return Request.CreateResponse(HttpStatusCode.OK, supplierOne);
        }


        [HttpPut]
        [Route("api/Suppliers/UpdateSupplier/{id}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateSupplier([FromUri]int id, [FromBody]Supplier supplier)
        {
            try
            {
                Supplier supplierEntity = db.Suppliers.Find(id);
                if (supplierEntity == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Supplier with SupplierId= " + id.ToString() + " is not found"));

                }
                else
                {

                    supplierEntity.SupplierName = supplier.SupplierName;
                    supplierEntity.ContactNo = supplier.ContactNo;
                    supplierEntity.Company = supplier.Company;
                    supplierEntity.CompanyId = supplier.CompanyId;
                    supplierEntity.CompanyAddress = supplier.CompanyAddress;
                    supplierEntity.FactoryAddress = supplier.FactoryAddress;
                    //supplierEntity.Status = supplier.Status;
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, supplierEntity));
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }

        [HttpPost]
        [Route("api/Suppliers/CreateSupplier")]
        [ResponseType(typeof(Supplier))]
        public IHttpActionResult CreateSupplier(Supplier supplier)
        {
            try
            {
                db.Suppliers.Add(supplier);
                db.SaveChanges();
                return Created(new Uri(Request.RequestUri + supplier.SupplierId.ToString()), supplier);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, ex));
            }

        }
        [HttpPost]
        [Route("api/Suppliers/DeleteSupplier")]
        [ResponseType(typeof(Supplier))]
        public IHttpActionResult DeleteSupplier(Supplier supplierObj)
        {

            try
            {
                Supplier supplier = db.Suppliers.Find(supplierObj.SupplierId);
                if (supplier == null)
                {

                    return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Supplier with Supplier Id= " + supplierObj.SupplierId.ToString() + " is not found"));

                }
                else
                {

                    db.Suppliers.Remove(supplier);
                    db.SaveChanges();
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Supplier Deleted"));
                }

            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
            }
        }


        //[HttpDelete]
        //[Route("api/Suppliers/DeleteSupplier/{id}")]
        //[ResponseType(typeof(Supplier))]
        //public IHttpActionResult DeleteSupplier(int id)
        //{

        //    try
        //    {
        //        Supplier supplier = db.Suppliers.Find(id);
        //        if (supplier == null)
        //        {

        //            return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Supplier with SupplierId= " + id.ToString() + " is not found"));

        //        }
        //        else
        //        {

        //            db.Suppliers.Remove(supplier);
        //            db.SaveChanges();
        //            return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, "Supplier Deleted"));
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex));
        //    }
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SupplierExists(int id)
        {
            return db.Suppliers.Count(e => e.SupplierId == id) > 0;
        }
    }
}