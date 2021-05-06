/// <reference path="angular.min.js" />

var productApp = angular.module('productApp', ['LocalStorageModule', 'AuthApp']);

productApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

productApp.directive('ngFiles', ['$parse', function ($parse) {
        function fn_link(scope, element, attrs) {
            var onChange = $parse(attrs.ngFiles);

            element.on('change', function (event) {
                onChange(scope, { $files: event.target.files });
            })
        }

        return {
            link: fn_link
        }

}]).controller('productController', [ '$scope', 'productService', function ($scope, productService, $http) {

   
    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.productObj = {};
        $scope.productObj.ProductId = 0;
        $scope.productObj.OriginalPrice = 0;
        $scope.productObj.MarkupPrice = 0;
        $scope.productObj.ProductQty = 0;
        $scope.TotalOrderDetailOriginalPrice = 0;
        $scope.TotalOrderReturnDetailOriginalPrice = 0;
        $scope.TotalTransactionDetailMarkupPrice = 0;
        $scope.TotalProductDetailOriginalPrice = 0;
        $scope.TotalSalesReturnDetailMarkupPrice = 0;
        $scope.TotalDiscount = 0;
        $scope.Product = {};
        //$scope.ddlCategory = {};
        $scope.btnSave = 'Add Product';
        $scope.selectedName = null;
        //$scope.Supplier.SupplierId = 0;
        $scope.CategoryList = [];
        $scope.CategoryTempList = [];
        $scope.AddproductList = [];
        $scope.productList = [];
        $scope.TransactionList = [];
        $scope.TransactionDetailList = [];
        $scope.OrderDetailList = [];
        $scope.OrderReturnDetailList = [];
        $scope.SalesReturnDetailList = [];
        GetAllTransaction();
        GetAllCategorys();
        GetAllProduct();
        //  GetProductSave();
        LoadProduct();
        GetAllOrderDetail();
        GetAllTransactionDetail();
        GetAllSalesReturnDetail();
        GetAllOrderReturnDetail();
        //balanceSheet();


        ////////////////////////////////

        $scope.Message = "";
        $scope.FileInvalidMessage = "";
        $scope.SelectedFileForUpload = null;
        $scope.FileDescription = "";
        $scope.ProductId = 1;
        $scope.IsFormSubmitted = false;
        $scope.IsFileValid = false;
        $scope.IsFormValid = false;
    }
    //Form Validation
    $scope.$watch("f1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });

    $scope.ChechFileValid = function (file) {
        var isValid = false;
        if ($scope.SelectedFileForUpload != null) {
            //if ((file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') && file.size <= (512 * 1024)) {
            if ((file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif')) {
                $scope.FileInvalidMessage = "";
                isValid = true;
            }
            else {
                $scope.FileInvalidMessage = "Selected file is Invalid. (only file type png, jpeg and gif and 512 kb size allowed)";
            }
        }
        else {
            $scope.FileInvalidMessage = "Image required!";
        }
        $scope.IsFileValid = isValid;
    };

    //File Select event 
    $scope.selectFileforUpload = function (file) {
        $scope.SelectedFileForUpload = file[0];
    }
    //----------------------------------------------------------------------------------------

    //Save File
    $scope.SaveFile = function () {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";
        $scope.ChechFileValid($scope.SelectedFileForUpload);
        if ($scope.IsFormValid && $scope.IsFileValid) {
            productService.UploadFile($scope.SelectedFileForUpload, $scope.FileDescription, $scope.ProductId = 1).then(function (d) {
                alert(d.Message);
                ClearForm();
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };
    //Clear form 
    function ClearForm() {
        $scope.FileDescription = "";
        $scope.ProductId = 1;
        //as 2 way binding not support for File input Type so we have to clear in this way
        //you can select based on your requirement
        angular.forEach(angular.element("input[type='file']"), function (inputElem) {
            angular.element(inputElem).val(null);
        });

        $scope.f1.$setPristine();
        $scope.IsFormSubmitted = false;
    }

    //ClearProduct();
    //function ClearProduct() {

    //    $scope.productObj = new Object();
    //}
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }
    function LoadProduct() {
        var product = sessionStorage.getItem("Product");
        if (product != null) {
            $scope.btnSave = 'Update Product';
            $scope.productObj = JSON.parse(sessionStorage.Product);
            console.log($scope.productObj);
            $scope.ddlCategory = { CategoryId: $scope.productObj.CategoryId };
            //$scope.productObj = angular.copy($scope.productObj);
        }
        sessionStorage.removeItem("Product");
    }
    function ResetObject() {
        $scope.productObj = {};
        $scope.productObj.ProductId = 0;
        $scope.productObj.CategoryId = 0;
        //$scope.ddlCategory = {};
        $scope.ddlCategory = null;
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.resetProduct = function () {
        ResetObject();
        $scope.AddproductList = [];

    }
    $scope.addProduct = function () {

        //for (var i = 0; i < $scope.productList.length; i++) {
        //    if ($scope.productList[i].ProductNo == $scope.productObj.ProductNo) {
        //        alert("Project is Exits!!!");
        //        return;
        //    }
        //}

        $scope.productObj.CategoryId = $scope.ddlCategory.CategoryId;
        $scope.AddproductList.push($scope.productObj);
        $scope.productObj = {};
    }


    $scope.removebtn = function (productObj) {
        var index = $scope.AddproductList.indexOf(productObj);
        $scope.AddproductList.splice(index, 1);
    }


    function GetAllCategorys() {
        productService.GetAllCategorys().then(function (response) {
            $scope.CategoryList = response.data;
        }, function () {
            alert("Failed to get Category!");
        })
    }

    function GetAllProduct() {
        productService.GetAllProduct().then(function (response) {
            $scope.productList = response.data;
            console.log($scope.productList);
            for (var i = 0; i < $scope.productList.length; i++) {
                $scope.ProductDetailSubOriginalPrice = $scope.productList[i].ProductQty * $scope.productList[i].OriginalPrice;
                $scope.TotalProductDetailOriginalPrice += $scope.ProductDetailSubOriginalPrice;
            }
            console.log($scope.TotalProductDetailOriginalPrice);
            //balanceSheet();
        }, function () {
            alert("Failed to get Category!");
        })
    }

    $scope.ProductSave = function () {

        productService.PostProduct($scope.AddproductList).then(function (response) {
        }, function () {

            alert("Product Save Success !!!");
            Clear();
            window.location.href = "/Products/Index";
        });
    }
    $scope.Edit = function (product) {
        sessionStorage.setItem("Product", JSON.stringify(product));
        window.location.href = "/Products/Create"
    }

    //$scope.Delete = function (productObj) {
    //    var r = confirm("Are you sure you want to delete?");
    //    if (r == true) {
    //        productService.DeleteProduct(productObj).then(function (response) {
    //            alert("Supplier Deleted Successfully");
    //            //window.location.reload();
    //        }, function () {
    //            alert("Error occured. Please try again.");

    //        });
    //    } else {
    //        return;
    //    }
    //}
    $scope.AddNew = function () {
        window.location.href = "/Products/Create";
    }
    $scope.RedirectToList = function () {
        window.location.href = "/Products/Index";
    }

    $scope.Delete = function (productObj) {
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            productService.DeleteProduct(productObj).then(function (response) {
                alert("Product Deleted Successfully");
                window.location.reload();
            }, function () {
                alert("Error occured. Please try again.");

            });
        } else {
            return;
        }
        
    }

    $scope.editProductBtn = function (cid) {
        window.location.href = "/Products/Create"
        $scope.ddlCategory = { CategoryId: cid.CategoryId }
        $scope.productObj = cid;
    }

    function GetAllOrderDetail() {
        productService.GetAllOrderDetail().then(function (response) {
            $scope.OrderDetailList = response.data;
            console.log($scope.OrderDetailList);

            for (var i = 0; i < $scope.OrderDetailList.length; i++) {
                $scope.OrderDetailSubOriginalPrice = $scope.OrderDetailList[i].ProductQty * $scope.OrderDetailList[i].OriginalPrice;
                $scope.TotalOrderDetailOriginalPrice += $scope.OrderDetailSubOriginalPrice;
            }
            console.log($scope.TotalOrderDetailOriginalPrice);
            //balanceSheet();
        }, function () {
            alert("Failed to get Order!");
        })
    }
    function GetAllOrderReturnDetail() {
        productService.GetAllOrderReturnDetail().then(function (response) {
            $scope.OrderReturnDetailList = response.data;
            for (var i = 0; i < $scope.OrderReturnDetailList.length; i++) {
                $scope.OrderReturnDetailSubOriginalPrice = $scope.OrderReturnDetailList[i].ProductQty * $scope.OrderReturnDetailList[i].OriginalPrice;
                $scope.TotalOrderReturnDetailOriginalPrice += $scope.OrderReturnDetailSubOriginalPrice;
            }

            console.log($scope.OrderReturnDetailList);
            //balanceSheet();
        }, function () {
            alert("Failed to get OrderReturn!");
        })
    }

    function GetAllSalesReturnDetail() {
        productService.GetAllSalesReturnDetail().then(function (response) {
            $scope.SalesReturnDetailList = response.data;
            console.log($scope.SalesReturnDetailList);

            for (var i = 0; i < $scope.SalesReturnDetailList.length; i++) {
                $scope.SalesReturnDetailSubMarkupPrice = $scope.SalesReturnDetailList[i].ProductQty * $scope.SalesReturnDetailList[i].MarkupPrice;
                $scope.TotalSalesReturnDetailMarkupPrice += $scope.SalesReturnDetailSubMarkupPrice;
            }
            //balanceSheet();
        }, function () {
            alert("Failed to get SalesReturn!");
        })
    }

    function GetAllTransactionDetail() {
        productService.GetAllTransactionDetail().then(function (response) {
            $scope.TransactionDetailList = response.data;
            console.log($scope.TransactionDetailList);
            GetAllTransaction();

            for (var i = 0; i < $scope.TransactionList.length; i++) {
                $scope.TotalDiscount += $scope.TransactionList[i].TransDiscountAmount;
            }


            for (var i = 0; i < $scope.TransactionDetailList.length; i++) {
                $scope.TransactionDetailSubMarkupPrice = $scope.TransactionDetailList[i].ProductQty * $scope.TransactionDetailList[i].MarkupPrice;
                $scope.TotalTransactionDetailMarkupPrice += $scope.TransactionDetailSubMarkupPrice;
            }
            $scope.TotalTransactionDetailMarkupPrice -= $scope.TotalDiscount;
            console.log($scope.TotalTransactionDetailMarkupPrice);
            //balanceSheet();
        }, function () {
            alert("Failed to get Transaction Detail!");
        })
    }

    function GetAllTransaction() {
        productService.GetAllTransaction().then(function (response) {
            $scope.TransactionList = response.data;
            console.log($scope.TransactionList);

        }, function () {
            alert("Failed to get Order!");
        })
    };

    $scope.balanceSheet = function () {
        balanceSheet();
    }

    function balanceSheet() {
        
        if ($scope.TotalTransactionDetailMarkupPrice != 0 && $scope.TotalOrderDetailOriginalPrice != 0 && $scope.TotalProductDetailOriginalPrice != 0 && $scope.TotalOrderReturnDetailOriginalPrice != 0 && $scope.TotalSalesReturnDetailMarkupPrice != 0) {
            $scope.TotalOrderDetailOriginalPrice = $scope.TotalOrderDetailOriginalPrice - $scope.TotalProductDetailOriginalPrice;
            $scope.TotalOrderDetailOriginalPrice = $scope.TotalOrderDetailOriginalPrice - $scope.TotalOrderReturnDetailOriginalPrice;
            $scope.TotalOrderDetailOriginalPrice = $scope.TotalOrderDetailOriginalPrice + $scope.TotalSalesReturnDetailMarkupPrice;

            $scope.balance = Math.abs($scope.TotalTransactionDetailMarkupPrice - $scope.TotalOrderDetailOriginalPrice);
            if ($scope.TotalTransactionDetailMarkupPrice > $scope.TotalOrderDetailOriginalPrice) {
                $scope.status = $scope.balance + " Taka Profit";
                $('#status').css('color', 'green');
            }
            else if ($scope.TotalTransactionDetailMarkupPrice < $scope.TotalOrderDetailOriginalPrice) {
                $scope.status = $scope.balance + " Taka loss";
                $('#status').css('color', 'red');
            } else if ($scope.TotalTransactionDetailMarkupPrice == $scope.TotalOrderDetailOriginalPrice){
                $scope.status = $scope.balance + " Taka Balance";
                $('#status').css('color', 'yellow');
            }
            $scope.balance = 0;
            $scope.TotalOrderDetailOriginalPrice = 0;
        }

        
    }

}])


productApp.factory('productService', ['$http', '$q', function ($http, $q) {

    var productAppFactory = {};

    productAppFactory.GetAllProduct = function () {
        return $http.get('/api/Products/GetAllProduct')
    }



    productAppFactory.GetAllCategorys = function () {
        return $http.get('/api/Products/GetCategorys')
    }
    productAppFactory.GetAllOrderDetail = function () {
        return $http.get('/api/Products/GetAllOrderDetail/')
    }
    productAppFactory.GetAllOrderReturnDetail = function () {
        return $http.get('/api/Products/GetAllOrderReturnDetail/')
    }
    productAppFactory.GetAllSalesReturnDetail = function () {
        return $http.get('/api/Products/GetAllSalesReturnDetail/')
    }
    productAppFactory.GetAllTransactionDetail = function () {
        return $http.get('/api/Products/GetAllTransactionDetail/')
    }
    productAppFactory.GetAllTransaction = function () {
        return $http.get('/api/Transactions/GetAllTransaction')
    }

    productAppFactory.PostProduct = function (productObj) {
        return $http.post('/api/Products/PostProduct', productObj)
    }

    
    productAppFactory.DeleteProduct = function (productObj) {
        return $http.post('/api/Products/DeleteProducts', productObj)
    };


    ///////////////////////////
    productAppFactory.UploadFile = function (file, description, ProductId) {
        var formData = new FormData();
        formData.append("file", file);
        //We can send more data to server using append         
        formData.append("description", description);
        formData.append("ProductId", ProductId);

        var defer = $q.defer();
        $http.post("/Products/SaveFiles", formData,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
            .then(function (d) {
                defer.resolve(d);
            });


        return defer.promise;

    }
    ///////////////////

    return productAppFactory;



}])