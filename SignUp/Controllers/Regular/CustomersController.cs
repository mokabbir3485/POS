﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SignUp.Controllers.Regular
{
    public class CustomersController : Controller
    {
        // GET: Customers
        public ActionResult Index()
        {
            return View();
        }

        
        // GET: Customers/Create
        public ActionResult Create()
        {
            return View();
        }

        
    }
}