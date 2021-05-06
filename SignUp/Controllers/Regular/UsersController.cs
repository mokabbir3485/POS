using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SignUp.Controllers.Regular
{
    public class UsersController : Controller
    { 
        // GET: Users
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Signup() 
        {
            return View();
        }
        public ActionResult Login()
        { 
            return View();
        }
        public ActionResult Role() 
        {
            return View();
        }
        public ActionResult UserRole() 
        {
            return View();
        }
        public ActionResult ChangePassword()
        {
            return View();
        }
        public ActionResult ForgotPassword()
        {
            return View();
        }

        public ActionResult ResetPassword() 
        {
            return View();
        }
        public ActionResult LogOut() 
        {
            return View();
        }



    }
}