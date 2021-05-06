
///<reference path="angular.js" />
/// <reference path="jquery-2.2.3.min.js" />
/// <reference path="jquery-ui.js" />

var orderReturnApp = angular.module('orderReturnApp', ['LocalStorageModule', 'AuthApp']);

orderReturnApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

orderReturnApp.controller('orderReturnController', ['$scope', '$filter', '$http', 'orderReturnService', function ($scope, $http, $filter, orderReturnService) {


    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.btnSave = 'Add Product';
        $scope.OrderReturnObj = {};
        $scope.productObj = {};
        $scope.productObjTemp = {};
        $scope.OrderReturnObj.OrderReturnAmmount = 0;
        $scope.OrderReturnObj.OrderReturnQuantity = 0;
        $scope.itemQty = 0;
        $scope.disableBtnAddProduct = true;
        $scope.OrderReturnList = [];
        $scope.productList = [];
        $scope.AddproductList = [];
        $scope.updateProductList = [];
        //$scope.SupplierList = [];
        GetAllOrderReturns();
        GetAllProduct();
        //GetAllSuppliers();
        LoadOrderReturn();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }

    function LoadOrderReturn() {
        var orderReturn = sessionStorage.getItem("OrderReturn");
        if (orderReturn != null) {
            $scope.btnSave = 'Update Return';
            $scope.OrderReturnObj = JSON.parse(sessionStorage.OrderReturn);
            console.log($scope.OrderReturnObj);
            GetAllOrderReturnDetail($scope.OrderReturnObj);
            var orderreturndate = new Date($scope.OrderReturnObj.OrderReturnDate);
            $('#orderReturnDate').val(orderreturndate.getFullYear() + '-' + ('0' + (orderreturndate.getMonth() + 1)).slice(-2) + '-' + ('0' + orderreturndate.getDate()).slice(-3));
           
            $scope.ddlSupplier = { SupplierId: $scope.OrderReturnObj.SupplierId };
        }
        sessionStorage.removeItem("OrderReturn");
    }


    function GetAllOrderReturns() {
        orderReturnService.GetAllOrderReturns().then(function (response) {
            $scope.OrderReturnList = response.data;
            console.log($scope.OrderReturnList);

        }, function () {
            alert("Failed to get OrderReturn!");
        })
    };
    function GetAllProduct() {
        orderReturnService.GetAllProduct().then(function (response) {
            $scope.productList = response.data;
        }, function () {
            alert("Failed to get Category!");
        })
    }
    //function GetAllSuppliers() {
    //    orderReturnService.GetAllSuppliers().then(function (response) {
    //        $scope.SupplierList = response.data;
    //    }, function () {
    //        alert("Failed to get supplier!");
    //    })
    //}
    function GetAllOrderReturnDetail(orderReturn) {
        orderReturnService.GetAllOrderReturnDetail(orderReturn).then(function (response) {
            $scope.AddproductList = response.data;
            console.log($scope.AddproductList);

        }, function () {
            alert("Failed to get OrderReturn!");
        })
    }
    $scope.btnDisable = function () {
        if ($scope.itemQty == 0 || $scope.itemQty == "" || $scope.itemQty == null) {
            $scope.disableBtnAddProduct = true;
        } else {
            $scope.disableBtnAddProduct = false;
        }

        //$scope.CheckProductQty = function () {
        //    if ($scope.ddlProduct.ProductQty == 0) {
        //        alert("Qty not available in the stock!!! " + $scope.ddlProduct.ProductQty + " " + $scope.ddlProduct.ProductName + " available in the stock!!!");
        //        $scope.itemQty = 0;
        //        $scope.disableTxtQty = true;
        //    } else {
        //        $scope.disableTxtQty = false;
        //    } 
        //}

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

        for (var i = 0; i < $scope.AddproductList.length; i++) {
            if ($scope.AddproductList[i].ProductNo == $scope.ddlProduct.ProductNo) {
                alert("Project is Exits!!!");
                return;
            }
        }
        $scope.productObj = $scope.ddlProduct;

        $scope.productObjTemp = angular.copy($scope.productObj);
        $scope.productObj.ProductQty = Number($scope.itemQty);
        $scope.Amount = $scope.productObj.ProductQty * $scope.productObj.OriginalPrice;
        $scope.OrderReturnObj.OrderReturnQuantity += $scope.productObj.ProductQty;
        $scope.OrderReturnObj.OrderReturnAmmount += Number($scope.Amount);

        $scope.AddproductList.push($scope.productObj);
        $scope.productObjTemp.ProductQty = Number($scope.productObjTemp.ProductQty) - Number($scope.itemQty);
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
    $scope.OrderReturnSave = function () {
        //$scope.OrderReturnObj.ProductId = $scope.ddlProduct.ProductId;
        //$scope.OrderReturnObj.SupplierId = $scope.ddlSupplier.SupplierId;
        $scope.OrderReturnObj.OrderReturnDate = convert($scope.OrderReturnObj.OrderReturnDate);
        orderReturnService.PostOrderReturn($scope.OrderReturnObj).then(function (response) {
            console.log(response.data.OrderReturnId);

            angular.forEach($scope.AddproductList, function (data) {
                data.OrderReturnId = response.data.OrderReturnId;
                orderReturnService.PostOrderReturnDetail(data).then(function (response) {
                    orderReturnService.PostProduct($scope.updateProductList).then(function (response) {
                    }, function () {
                        alert("Order Return Save Success !!!");
                        window.location.href = "/OrderReturn/Index";
                    });

                }, function () {
                    alert("Error occured. Please try again.");

                });

            });

        }, function () {
            alert("Error !!!");

        });
    }
    $scope.Delete = function (OrderReturnObj) {
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            orderReturnService.DeleteOrderReturn(OrderReturnObj).then(function (response) {
                alert("OrderReturn Deleted Successfully");
                window.location.reload();
            }, function () {
                alert("Error occured. Please try again.");

            });
        } else {
            return;
        }

    }
    function ResetObject() {
        $scope.OrderReturnObj = {};
        $scope.productObj = {};
        $scope.productObjTemp = {};
        $scope.OrderReturnObj.OrderReturnAmmount = 0;
        $scope.OrderReturnObj.OrderReturnQuantity = 0;
        $scope.itemQty = 0;
        $scope.ddlProduct = null;
        $scope.OriginalPrice = '';
        $scope.MarkupPrice = '';
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.resetProduct = function () {
        Clear();
    }

    $scope.Edit = function (orderReturn) {
        sessionStorage.setItem("OrderReturn", JSON.stringify(orderReturn));
        window.location.href = "/OrderReturn/Create"
    }

    $scope.removebtn = function (productObj) {
        if (productObj.OrderReturnDetailId == undefined) {
            $scope.OrderReturnObj.OrderReturnQuantity -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.OriginalPrice;
            $scope.OrderReturnObj.OrderReturnAmmount -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            return;
        }
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            $scope.OrderReturnObj.OrderReturnQuantity -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.OriginalPrice;
            $scope.OrderReturnObj.OrderReturnAmmount -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            orderReturnService.DeleteOrderReturnDetail(productObj).then(function (response) {
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
        window.location.href = "/OrderReturn/Create";
    }
    $scope.RedirectToList = function () {
        window.location.href = "/OrderReturn/Index";
    }
}]);


orderReturnApp.factory('orderReturnService', ['$http', '$filter', function ($http, $filter) {

    var orderReturnAppFactory = {};

    orderReturnAppFactory.GetAllOrderReturns = function () {
        return $http.get('/api/OrderReturns/GetAllOrderReturn')
    }
    orderReturnAppFactory.GetAllOrderReturnDetail = function (orderReturn) {
        return $http.get('/api/OrderReturns/GetAllOrderReturnDetail/' + orderReturn.OrderReturnId)
    }
    //orderReturnAppFactory.GetAllOrderReturnDetail = function () {
    //    return $http.get('/api/OrderReturns/GetAllOrderReturn')
    //}
    orderReturnAppFactory.GetAllProduct = function () {
        return $http.get('/api/Products/GetAllProduct')
    }
    //orderReturnAppFactory.GetAllSuppliers = function () {
    //    return $http.get('/api/Suppliers/AllSuppliers')
    //}
    orderReturnAppFactory.PostOrderReturn = function (OrderReturnObj) {
        return $http.post('/api/OrderReturns/PostOrderReturn', OrderReturnObj)
    }
    orderReturnAppFactory.PostOrderReturnDetail = function (OrderReturnDetailObj) {
        return $http.post('/api/OrderReturns/PostOrderReturnDetail', OrderReturnDetailObj)
    }
    orderReturnAppFactory.PostProduct = function (productObj) {
        return $http.post('/api/Products/PostProduct', productObj)
    }
    orderReturnAppFactory.DeleteOrderReturn = function (OrderReturnObj) {
        return $http.post('/api/OrderReturns/DeleteOrderReturns', OrderReturnObj)
    };
    orderReturnAppFactory.DeleteOrderReturnDetail = function (productObj) {
        return $http.post('/api/OrderReturns/DeleteOrderReturnDetails', productObj)
    };

    return orderReturnAppFactory;

}])

