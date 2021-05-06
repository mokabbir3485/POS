
///<reference path="angular.js" />
/// <reference path="jquery-2.2.3.min.js" />
/// <reference path="jquery-ui.js" />

var orderApp = angular.module('orderApp', ['LocalStorageModule', 'AuthApp']);

orderApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

orderApp.controller('orderController', ['$scope', '$filter', '$http', '$window', 'orderService', function ($scope, $http, $filter, $window, orderService) {


    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.btnSave = 'Add Product';
        $scope.OrderObj = {};
        $scope.productObj = {};
        $scope.productObjTemp = {};
        $scope.OrderObj.OrderTotal = 0;
        $scope.OrderObj.OrderQty = 0;
        $scope.itemQty = 0;
        $scope.disableBtnAddProduct = true;
        $scope.OrderList = [];
        $scope.productList = [];
        $scope.AddproductList = [];
        $scope.updateProductList = [];
        $scope.SupplierList = [];
        GetAllOrders();
        GetAllProduct();
        GetAllSuppliers();
        LoadOrder();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }

    function LoadOrder() {
        var order = sessionStorage.getItem("Order");
        if (order != null) {
            $scope.btnSave = 'Update Order';
            $scope.OrderObj = JSON.parse(sessionStorage.Order);
            console.log($scope.OrderObj);
            GetAllOrderDetail($scope.OrderObj);
            var orderdate = new Date($scope.OrderObj.OrderDate);
            $('#orderDate').val(orderdate.getFullYear() + '-' + ('0' + (orderdate.getMonth() + 1)).slice(-2) + '-' + ('0' + orderdate.getDate()).slice(-2));
            $scope.OrderObj.OrderTotal = Number($scope.OrderObj.OrderTotal);
            $scope.ddlSupplier = { SupplierId: $scope.OrderObj.SupplierId };
        }
        sessionStorage.removeItem("Order");
    }


    function GetAllOrders() {
        orderService.GetAllOrders().then(function (response) {
            $scope.OrderList = response.data;
            console.log($scope.OrderList);

        }, function () {
            alert("Failed to get Order!");
        })
    };
    function GetAllProduct() {
        orderService.GetAllProduct().then(function (response) {
            $scope.productList = response.data;
        }, function () {
            alert("Failed to get Category!");
        })
    }
    function GetAllSuppliers() {
        orderService.GetAllSuppliers().then(function (response) {
            $scope.SupplierList = response.data;
        }, function () {
            alert("Failed to get supplier!");
        })
    }
    function GetAllOrderDetail(order) {
        orderService.GetAllOrderDetail(order).then(function (response) {
            $scope.AddproductList = response.data;
            console.log($scope.AddproductList);

        }, function () {
            alert("Failed to get Order!");
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
            //$scope.itemQty = $scope.ddlProduct.ProductQty;
            alert($scope.ddlProduct.ProductQty + " " + $scope.ddlProduct.ProductName + " is vary low qty in the stock!!!");
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
        $scope.productObj.OriginalPrice = Number($scope.OriginalPrice);
        $scope.productObj.MarkupPrice = Number($scope.MarkupPrice);

        $scope.productObjTemp = angular.copy($scope.productObj);
        $scope.productObj.ProductQty = Number($scope.itemQty);
        $scope.Amount = $scope.productObj.ProductQty * $scope.productObj.OriginalPrice;
        $scope.OrderObj.OrderQty += $scope.productObj.ProductQty;
        $scope.OrderObj.OrderTotal += Number($scope.Amount);

        $scope.AddproductList.push($scope.productObj);
        $scope.productObjTemp.ProductQty = Number($scope.productObjTemp.ProductQty) + Number($scope.itemQty);
        $scope.updateProductList.push($scope.productObjTemp);

        $scope.productObj = {};
        $scope.productObjTemp = {};
        $scope.itemQty = 0;
        $scope.disableBtnAddProduct = true;
    }
    //$scope.addProduct = function () {

    //    //for (var i = 0; i < $scope.AddproductList.length; i++) {
    //    //    if ($scope.AddproductList[i].ProductNo == $scope.ddlProduct.ProductNo) {
    //    //        alert("Project is Exits!!!");
    //    //        return;
    //    //    }
    //    //}
    //    $scope.productObj = $scope.ddlProduct;
    //    $scope.productObj.OriginalPrice = Number($scope.OriginalPrice);
    //    $scope.productObj.MarkupPrice = Number($scope.MarkupPrice);

    //    $scope.productObjTemp = angular.copy($scope.productObj);
    //    $scope.productObj.ProductQty = Number($scope.itemQty);
    //    $scope.Amount = $scope.productObj.ProductQty * $scope.productObj.OriginalPrice;
    //    $scope.OrderObj.OrderQty += $scope.productObj.ProductQty;
    //    $scope.OrderObj.OrderTotal += Number($scope.Amount);

    //    $scope.AddproductList.push($scope.productObj);
    //    $scope.productObjTemp.ProductQty = Number($scope.productObjTemp.ProductQty) + Number($scope.itemQty);
    //    $scope.updateProductList.push($scope.productObjTemp);

    //    $scope.productObj = {};
    //    $scope.productObjTemp = {};
    //    $scope.itemQty = 0;
    //    $scope.disableBtnAddProduct = true;
    //}
    function convert(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    $scope.OrderSave = function () {
        //$scope.OrderObj.ProductId = $scope.ddlProduct.ProductId;
        $scope.OrderObj.SupplierId = $scope.ddlSupplier.SupplierId;

        $scope.OrderObj.OrderDate = convert($scope.OrderObj.OrderDate);
        console.log($scope.OrderObj.OrderDate);
        orderService.PostOrder($scope.OrderObj).then(function (response) {
            console.log(response.data.OrdedrId);
            var productCount = $scope.AddproductList.length;
            angular.forEach($scope.AddproductList, function (data) {
                
                data.OrdedrId = response.data.OrdedrId;
                orderService.PostOrderDetail(data).then(function (response) {
                    productCount--;
                    if (productCount == 0) {
                        orderService.PostProduct($scope.updateProductList).then(function (response) {
                        }, function () {
                            window.location.href = "/Orders/Index";
                            alert("Order Save Success !!!");

                        });
                    }
                    
                    
                }, function () {
                    alert("Error occured. Please try again.");
                    
                });
               
            });
            
        }, function () {
                alert("Error !!!");
            
        });
    }
    $scope.Delete = function (OrderObj) {
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            orderService.DeleteOrder(OrderObj).then(function (response) {
                alert("Order Deleted Successfully");
                window.location.reload();
            }, function () {
                alert("Error occured. Please try again.");

            });
        } else {
            return;
        }

    }
    function ResetObject() {
        //Clear();
        $scope.OrderObj = {};
        $scope.ddlSupplier = null;
        $scope.ddlProduct = null;
        $scope.OriginalPrice = "";
        $scope.MarkupPrice = "";
        $scope.itemQty = 0;
        $scope.OrderObj.OrderTotal = 0;
        $scope.OrderObj.OrderQty = 0;
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.resetProduct = function () {
        Clear();
    }
    $scope.Edit = function (order) {
        sessionStorage.setItem("Order", JSON.stringify(order));
        window.location.href = "/Orders/Create"
    }
    $scope.Report = function (orderReport) {
        sessionStorage.setItem("OrderReport", JSON.stringify(orderReport));
        $window.open("/Orders/Report", "popup", "width=800,height=550,left=280,top=80");
        event.stopPropagation();
    };

    $scope.removebtn = function (productObj) {
        if (productObj.OrderDetailId == undefined) {
            $scope.OrderObj.OrderQty -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.OriginalPrice;
            $scope.OrderObj.OrderTotal -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            return;
        }
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            $scope.OrderObj.OrderQty -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.OriginalPrice;
            $scope.OrderObj.OrderTotal -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            orderService.DeleteOrderDetail(productObj).then(function (response) {
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
        window.location.href = "/Orders/Create";
    }
    $scope.RedirectToList = function () {
        window.location.href = "/Orders/Index";
    }
}]);


orderApp.factory('orderService', ['$http', '$filter', function ($http, $filter) {

    var orderAppFactory = {};

    orderAppFactory.GetAllOrders = function () {
        return $http.get('/api/Orders/GetAllOrder')
    }
    orderAppFactory.GetAllOrderDetail = function (order) {
        return $http.get('/api/Orders/GetAllOrderDetail/' + order.OrdedrId)
    }
    //orderAppFactory.GetAllOrderDetail = function () {
    //    return $http.get('/api/Orders/GetAllOrder')
    //}
    orderAppFactory.GetAllProduct = function () {
        return $http.get('/api/Products/GetAllProduct')
    }
    orderAppFactory.GetAllSuppliers = function () {
        return $http.get('/api/Suppliers/AllSuppliers')
    }
    orderAppFactory.PostOrder = function (OrderObj) {
        return $http.post('/api/Orders/PostOrder', OrderObj)
    }
    orderAppFactory.PostOrderDetail = function (OrderDetailObj) {
        return $http.post('/api/Orders/PostOrderDetail', OrderDetailObj)
    }
    orderAppFactory.PostProduct = function (productObj) {
        return $http.post('/api/Products/PostProduct', productObj)
    }
    orderAppFactory.DeleteOrder = function (OrderObj) {
        return $http.post('/api/Orders/DeleteOrders', OrderObj)
    };
    orderAppFactory.DeleteOrderDetail = function (productObj) {
        return $http.post('/api/Orders/DeleteOrderDetails', productObj)
    };
    
    return orderAppFactory;

}])

