
///<reference path="angular.js" />
/// <reference path="jquery-2.2.3.min.js" />
/// <reference path="jquery-ui.js" />

var transactionReportApp = angular.module('transactionReportApp', ['LocalStorageModule', 'AuthApp']);

transactionReportApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

transactionReportApp.controller('transactionReportController', ['$scope', '$filter', '$http', '$window', 'transactionReportService', function ($scope, $http, $filter, $window, transactionReportService) {


    Clear();
    function Clear() {

        $scope.Transaction = {};
        $scope.updateCheck = {};
        $scope.TransactionReport = {};
        $scope.CustomerObj = {};
        $scope.TotalAmountReport = 0;
        $scope.productObj = {};
        $scope.TransactionList = [];
        $scope.productList = [];
        $scope.BankDetailList = [];
        $scope.AddproductList = [];
        $scope.updateProductList = [];
        $scope.CustomerList = [];
        GetAllTransaction();
        GetAllProduct();
        GetAllBankDetails();
        GetAllCustomers();
        LoadTransactionReport();
        GetDateTimeFormat();
        $scope.name = "Shuvo";
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
    function LoadTransactionReport() {
        var transactionReport = sessionStorage.getItem("TransactionReport");
        if (transactionReport != null) {
            $scope.btnSave = 'Update Transaction';
            $scope.TransactionReport = JSON.parse(sessionStorage.TransactionReport);
            console.log($scope.TransactionReport);
            GetAllTransactionDetail($scope.TransactionReport);
            $scope.transactiondateReport = new Date($scope.TransactionReport.TransactionDate);
            $scope.transactiondateReport = ('0' + $scope.transactiondateReport.getDate()).slice(-2) + '-' + ('0' + ($scope.transactiondateReport.getMonth() + 1)).slice(-2) + '-' + $scope.transactiondateReport.getFullYear();
            $scope.TransactionReport.SubTotal = Number($scope.TransactionReport.SubTotal);
            $scope.ddlCustomer = { CustomerId: $scope.TransactionReport.CustomerId };
            GetAllCustomers();
            $scope.ddlBankDetail = { BankId: $scope.TransactionReport.BankId };
            if ($scope.ddlBankDetail.BankId == null) {
                $scope.PaymentType = 2;
            } else {
                $scope.PaymentType = 1;
            }

        }
        sessionStorage.removeItem("Transaction");
    }


    function GetAllTransaction() {
        transactionReportService.GetAllTransaction().then(function (response) {
            $scope.TransactionList = response.data;
            console.log($scope.TransactionList);

        }, function () {
            alert("Failed to get transaction!");
        })
    };
    function GetAllProduct() {
        transactionReportService.GetAllProduct().then(function (response) {
            $scope.productList = response.data;
        }, function () {
            alert("Failed to get Category!");
        })
    }
    function GetAllCustomers() {
        transactionReportService.GetAllCustomers().then(function (response) {
            $scope.CustomerList = response.data;
            $scope.Customer = $scope.CustomerList.find(cust => cust.CustomerId === $scope.TransactionReport.CustomerId);
        }, function () {
            alert("Failed to get customer!");
        })
    }
    function GetAllBankDetails() {
        transactionReportService.GetAllBankDetails().then(function (response) {
            $scope.BankDetailList = response.data;
        }, function () {
            alert("Failed to get Bank Detail!");
        })
    }
    function GetAllTransactionDetail(transaction) {
        transactionReportService.GetAllTransactionDetail(transaction).then(function (response) {
            $scope.AddproductList = response.data;
            angular.forEach($scope.AddproductList, function (data) {
                data.ProductAmount = data.ProductQty * data.MarkupPrice;
                $scope.TotalAmountReport += data.ProductAmount;
            })

            console.log($scope.AddproductList);

        }, function () {
            alert("Failed to get Transaction Detail!");
        })
    }




    $scope.Edit = function (transaction) {
        sessionStorage.setItem("Transaction", JSON.stringify(transaction));
        window.location.href = "/Transactions/Create"
    }

    $scope.Report = function (transactionReport) {
        sessionStorage.setItem("TransactionReport", JSON.stringify(transactionReport));
        $window.open("/Transactions/Report", "popup", "width=800,height=550,left=280,top=80");
        event.stopPropagation();
    };

}]);


transactionReportApp.factory('transactionReportService', ['$http', '$filter', function ($http, $filter) {

    var transactionReportAppFactory = {};

    transactionReportAppFactory.GetAllTransaction = function () {
        return $http.get('/api/Transactions/GetAllTransaction')
    }
    transactionReportAppFactory.GetAllTransactionDetail = function (transaction) {
        return $http.get('/api/Transactions/GetAllTransactionDetail/' + transaction.TransactionId)
    }
    transactionReportAppFactory.GetAllProduct = function () {
        return $http.get('/api/Products/GetAllProduct')
    }
    transactionReportAppFactory.GetAllBankDetails = function () {
        return $http.get('/api/BankDetails/AllBankDetails')
    }
    transactionReportAppFactory.GetAllCustomers = function () {
        return $http.get('/api/Customers/AllCustomers')
    }



    return transactionReportAppFactory;

}])

