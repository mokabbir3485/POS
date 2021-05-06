
///<reference path="angular.js" />
/// <reference path="jquery-2.2.3.min.js" />
/// <reference path="jquery-ui.js" />

var salesReturnApp = angular.module('salesReturnApp', ['LocalStorageModule', 'AuthApp']);

salesReturnApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

salesReturnApp.controller('salesReturnController', ['$scope', '$filter', '$http', 'salesReturnService', function ($scope, $http, $filter, salesReturnService) {


    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.btnSave = 'Add Product';
        $scope.SalesReturnObj = {};
        $scope.productObj = {};
        $scope.productObjTemp = {};
        $scope.SalesReturnObj.SalesReturnAmount = 0;
        $scope.SalesReturnObj.SalesReturnQuantity = 0;
        $scope.itemQty = 0;
        $scope.OriginalPrice = '';
        $scope.MarkupPrice = '';
        $scope.disableBtnAddProduct = true;
        $scope.disDate = true;
        $scope.SalesReturnList = [];
        $scope.productList = [];
        $scope.AddproductList = [];
        $scope.updateProductList = [];
        GetAllSalesReturns();
        GetAllProduct();
        LoadSalesReturn();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }
    $scope.disSave = function () {
        $scope.disDate = false;
    }
    function LoadSalesReturn() {
        var salesReturn = sessionStorage.getItem("SalesReturn");
        if (salesReturn != null) {
            $scope.btnSave = 'Update Return';
            $scope.SalesReturnObj = JSON.parse(sessionStorage.SalesReturn);
            console.log($scope.SalesReturnObj);
            GetAllSalesReturnDetail($scope.SalesReturnObj);
            var salesreturndate = new Date($scope.SalesReturnObj.SalesReturnDate);
            $('#salesReturndateDate').val(salesreturndate.getFullYear() + '-' + ('0' + (salesreturndate.getMonth() + 1)).slice(-2) + '-' + ('0' + salesreturndate.getDate()).slice(-2));
            
        }
        sessionStorage.removeItem("SalesReturn");
    }


    function GetAllSalesReturns() {
        salesReturnService.GetAllSalesReturns().then(function (response) {
            $scope.SalesReturnList = response.data;
            console.log($scope.SalesReturnList);

        }, function () {
            alert("Failed to get SalesReturn!");
        })
    };
    function GetAllProduct() {
        salesReturnService.GetAllProduct().then(function (response) {
            $scope.productList = response.data;
        }, function () {
            alert("Failed to get Product!");
        })
    }

    function GetAllSalesReturnDetail(salesReturn) {
        salesReturnService.GetAllSalesReturnDetail(salesReturn).then(function (response) {
            $scope.AddproductList = response.data;
            console.log($scope.AddproductList);

        }, function () {
            alert("Failed to get SalesReturn!");
        })
    }
    $scope.btnDisable = function () {
        if ($scope.itemQty == 0 || $scope.itemQty == "" || $scope.itemQty == null) {
            $scope.disableBtnAddProduct = true;
        } else {
            $scope.disableBtnAddProduct = false;
        }


    }
    $scope.checkQty = function () {
        if ($scope.ddlProduct.ProductQty < 6) {
            alert($scope.ddlProduct.ProductQty + " " + $scope.ddlProduct.ProductName + " is vary low qty in the stock!!!");
            $scope.disableTxtQty = false;
            $scope.disableBtnAddProduct = false;
        }

        if ($scope.ddlProduct.ProductQty == 0) {
            alert("Qty not available in the stock!!! " + $scope.ddlProduct.ProductQty + " " + $scope.ddlProduct.ProductName + " available in the stock!!!");
            $scope.itemQty = 0;
            $scope.disableTxtQty = true;
            $scope.disableBtnAddProduct = true;
        } else {
            $scope.disableTxtQty = false;
        }
    }
    $scope.addProduct = function () {

        //for (var i = 0; i < $scope.AddproductList.length; i++) {
        //    if ($scope.AddproductList[i].ProductNo == $scope.ddlProduct.ProductNo) {
        //        alert("Project is Exits!!!");
        //        return;
        //    }
        //}
        $scope.productObj = $scope.ddlProduct;

        $scope.productObjTemp = angular.copy($scope.productObj);
        $scope.productObj.ProductQty = Number($scope.itemQty);
        $scope.productObj.SalesReturnDate = $scope.SalesReturnObj.SalesReturnDate;
        $scope.Amount = $scope.productObj.ProductQty * $scope.productObj.MarkupPrice;
        $scope.SalesReturnObj.SalesReturnQuantity += $scope.productObj.ProductQty;
        $scope.SalesReturnObj.SalesReturnAmount += Number($scope.Amount);

        $scope.AddproductList.push($scope.productObj);
        $scope.productObjTemp.ProductQty = Number($scope.productObjTemp.ProductQty) + Number($scope.itemQty);
        $scope.updateProductList.push($scope.productObjTemp);

        $scope.productObj = {};
        $scope.productObjTemp = {};
        $scope.itemQty = 0;
        $scope.disableBtnAddProduct = true;
    }
    function convert(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    $scope.SalesReturnSave = function () {
        $scope.SalesReturnObj.SalesReturnDate = convert($scope.SalesReturnObj.SalesReturnDate);
        salesReturnService.PostSalesReturn($scope.SalesReturnObj).then(function (response) {
            console.log(response.data.SalesReturnId);

            angular.forEach($scope.AddproductList, function (data) {
                data.SalesReturnId = response.data.SalesReturnId;
                salesReturnService.PostSalesReturnDetail(data).then(function (response) {
                    salesReturnService.PostProduct($scope.updateProductList).then(function (response) {
                    }, function () {
                        alert("Sales Save Success !!!");
                        window.location.href = "/SalesReturns/Index";
                    });

                }, function () {
                    alert("Error occured. Please try again.");

                });

            });

        }, function () {
            alert("Error !!!");

        });
    }
    $scope.Delete = function (SalesReturnObj) {
        salesReturnService.GetAllSalesReturnDetail(SalesReturnObj).then(function (responset) {
            $scope.AddproductList = responset.data;

            salesReturnService.GetAllProduct().then(function (responsep) {
                $scope.productList = responsep.data;
                if ($scope.AddproductList.length > 0 && $scope.productList.length > 0) {
                    angular.forEach($scope.productList, function (datap) {
                        angular.forEach($scope.AddproductList, function (datat) {
                            if (datat.ProductId == datap.ProductId) {

                                datat.ProductNo = datap.ProductNo;
                                datat.Description = datap.Description;
                                datat.CategoryId = datap.CategoryId;
                                datat.ProductQty = datap.ProductQty - datat.ProductQty;
                            }
                        })
                    })
                    var r = confirm("Are you sure you want to delete?");
                    if (r == true) {
                        salesReturnService.PostProduct($scope.AddproductList).then(function (response) {

                        });
                        salesReturnService.DeleteSalesReturn(SalesReturnObj).then(function (response) {
                            alert("SalesReturn Deleted Successfully");
                            window.location.reload();
                        }, function () {
                            alert("Error occured. Please try again.");

                        });

                    } else {
                        return;
                    }
                }
            });


        }, function () {
            alert("Failed to get SalesReturnObj Detail!");
        })


    }

    //$scope.Delete = function (SalesReturnObj) {
    //    var r = confirm("Are you sure you want to delete?");
    //    if (r == true) {
    //        salesReturnService.DeleteSalesReturn(SalesReturnObj).then(function (response) {
    //            alert("SalesReturn Deleted Successfully");
    //            window.location.reload();
    //        }, function () {
    //            alert("Error occured. Please try again.");

    //        });
    //    } else {
    //        return;
    //    }

    //}
    function ResetObject() {
        $scope.SalesReturnObj = {};
        $scope.itemQty = 0;
        $scope.ddlProduct = null;
        $scope.OriginalPrice = '';
        $scope.MarkupPrice = '';
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.ResetAll = function () {
        Clear();
    }

    $scope.Edit = function (salesReturn) {
        sessionStorage.setItem("SalesReturn", JSON.stringify(salesReturn));
        window.location.href = "/SalesReturns/Create"
    }

    $scope.removebtn = function (productObj) {
        if (productObj.SalesReturnDetailId == undefined) {
            $scope.SalesReturnObj.SalesReturnQuantity -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.MarkupPrice;
            $scope.SalesReturnObj.SalesReturnAmount -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            return;
        }
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            $scope.SalesReturnObj.SalesReturnQuantity -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.MarkupPrice;
            $scope.SalesReturnObj.SalesReturnAmount -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            salesReturnService.DeleteSalesReturnDetail(productObj).then(function (response) {
                alert("Product Deleted Successfully");
                //window.location.reload();
            }, function () {
                alert("Error occured. Please try again.");

            });
        } else {
            return;
        }
    }
    $scope.AddNew = function () {
        window.location.href = "/SalesReturns/Create";
    }
    $scope.RedirectToList = function () {
        window.location.href = "/SalesReturns/Index";
    }
}]);


salesReturnApp.factory('salesReturnService', ['$http', '$filter', function ($http, $filter) {

    var salesReturnAppFactory = {};

    salesReturnAppFactory.GetAllSalesReturns = function () {
        return $http.get('/api/SalesReturns/GetAllSalesReturn')
    }
    salesReturnAppFactory.GetAllSalesReturnDetail = function (salesReturn) {
        return $http.get('/api/SalesReturns/GetAllSalesReturnDetail/' + salesReturn.SalesReturnId)
    }
    //salesReturnAppFactory.GetAllSalesReturnDetail = function () {
    //    return $http.get('/api/SalesReturns/GetAllSalesReturn')
    //}
    salesReturnAppFactory.GetAllProduct = function () {
        return $http.get('/api/Products/GetAllProduct')
    }
    salesReturnAppFactory.PostSalesReturn = function (SalesReturnObj) {
        return $http.post('/api/SalesReturns/PostSalesReturn', SalesReturnObj)
    }
    salesReturnAppFactory.PostSalesReturnDetail = function (SalesReturnDetailObj) {
        return $http.post('/api/SalesReturns/PostSalesReturnDetail', SalesReturnDetailObj)
    }
    salesReturnAppFactory.PostProduct = function (productObj) {
        return $http.post('/api/Products/PostProduct', productObj)
    }
    salesReturnAppFactory.DeleteSalesReturn = function (SalesReturnObj) {
        return $http.post('/api/SalesReturns/DeleteSalesReturns', SalesReturnObj)
    };
    salesReturnAppFactory.DeleteSalesReturnDetail = function (productObj) {
        return $http.post('/api/SalesReturns/DeleteSalesReturnDetails', productObj)
    };

    return salesReturnAppFactory;

}])

