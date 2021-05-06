
///<reference path="angular.js" />
/// <reference path="jquery-2.2.3.min.js" />
/// <reference path="jquery-ui.js" />

var orderReportApp = angular.module('orderReportApp', ['LocalStorageModule', 'AuthApp']);

orderReportApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

orderReportApp.controller('orderReportController', ['$scope', '$filter', '$http', 'orderReportService', function ($scope, $http, $filter, orderReportService) {


    Clear();
    function Clear() {
        $scope.OrderObj = {};
        $scope.productObj = {};
        $scope.productObjTemp = {};
        $scope.disableBtnAddProduct = true;
        $scope.OrderList = [];
        $scope.productList = [];
        $scope.AddproductList = [];
        $scope.updateProductList = [];
        $scope.SupplierList = [];
        $scope.TotalAmountReport = 0;
        GetAllOrders();
        GetAllProduct();
        GetAllSuppliers();
        LoadReportOrder();
        GetDateTimeFormat();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }
    function GetDateTimeFormat() {
        function formatDate(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
        }
        var currentDatetime = new Date();
        $scope.currentDatetimeFormated = formatDate(currentDatetime);

    }
    function LoadReportOrder() {
        var orderReport = sessionStorage.getItem("OrderReport");
        if (orderReport != null) {
            $scope.btnSave = 'Update Order';
            $scope.OrderObjReport = JSON.parse(sessionStorage.OrderReport);
            console.log($scope.OrderObjReport);
            GetAllOrderDetail($scope.OrderObjReport);
            
            $scope.orderdateReport = new Date($scope.OrderObjReport.OrderDate);
            $scope.orderdateReport = ('0' + $scope.orderdateReport.getDate()).slice(-2) + '-' + ('0' + ($scope.orderdateReport.getMonth() + 1)).slice(-2) + '-' + $scope.orderdateReport.getFullYear();
            $scope.OrderObj.OrderTotal = Number($scope.OrderObj.OrderTotal);
            GetAllSuppliers();
            $scope.ddlSupplier = { SupplierId: $scope.OrderObj.SupplierId };
        }
        sessionStorage.removeItem("Order");
    }


    function GetAllOrders() {
        orderReportService.GetAllOrders().then(function (response) {
            $scope.OrderList = response.data;
            console.log($scope.OrderList);

        }, function () {
            alert("Failed to get Order!");
        })
    };
    function GetAllProduct() {
        orderReportService.GetAllProduct().then(function (response) {
            $scope.productList = response.data;
        }, function () {
            alert("Failed to get Category!");
        })
    }
    function GetAllSuppliers() {
        orderReportService.GetAllSuppliers().then(function (response) {
            $scope.SupplierList = response.data;
            $scope.Supplier = $scope.SupplierList.find(cust => cust.SupplierId === $scope.OrderObjReport.SupplierId);
        }, function () {
            alert("Failed to get supplier!");
        })
    }
    function GetAllOrderDetail(order) {
        orderReportService.GetAllOrderDetail(order).then(function (response) {
            $scope.AddproductList = response.data;
            angular.forEach($scope.AddproductList, function (data) {
                data.ProductAmount = data.ProductQty * data.OriginalPrice;
                $scope.TotalAmountReport += data.ProductAmount;
            })
            console.log($scope.AddproductList);

        }, function () {
            alert("Failed to get Order!");
        })
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
}]);


orderReportApp.factory('orderReportService', ['$http', '$filter', function ($http, $filter) {

    var orderReportAppFactory = {};

    orderReportAppFactory.GetAllOrders = function () {
        return $http.get('/api/Orders/GetAllOrder')
    }
    orderReportAppFactory.GetAllOrderDetail = function (order) {
        return $http.get('/api/Orders/GetAllOrderDetail/' + order.OrdedrId)
    }
    orderReportAppFactory.GetAllProduct = function () {
        return $http.get('/api/Products/GetAllProduct')
    }
    orderReportAppFactory.GetAllSuppliers = function () {
        return $http.get('/api/Suppliers/AllSuppliers')
    }
    

    return orderReportAppFactory;

}])

