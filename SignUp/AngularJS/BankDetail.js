///<reference path="angular.js" />

var bankDetailApp = angular.module('bankDetailApp', ['LocalStorageModule', 'AuthApp']);

bankDetailApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

bankDetailApp.controller('bankDetailController', ['$scope', 'bankDetailService', function ($scope, bankDetailService) {


    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.BankDetail = {};
        $scope.btnSave = 'Add Bank Detail';
        $scope.AccountFor = 0;
        $scope.BankDetail.BankId = 0;
        $scope.BankDetail.AccountFor = 0;
        $scope.BankDetail.AccountRefId = 0;
        $scope.BankDetailList = [];
        $scope.BankDetailTempList = [];
        $scope.CustomerList = [];
        $scope.CompanyList = [];
        $scope.ddlAccountRefId = {};
        GetAllBankDetails();
        LoadBankDetail();
        GetAllCustomers();
        GetAllCompanies();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }
    function LoadBankDetail() {
        var bankDetail = sessionStorage.getItem("BankDetail");
        if (bankDetail != null) {
            $scope.btnSave = 'Update Bank Detail';
            $scope.BankDetail = JSON.parse(sessionStorage.BankDetail);
            $scope.AccountFor = $scope.BankDetail.AccountFor;
            if ($scope.BankDetail.AccountFor == 1) {
                $scope.ddlAccountRefId = { CustomerId: $scope.BankDetail.AccountRefId };
            }
            else if ($scope.BankDetail.AccountFor == 2) {
                $scope.ddlAccountRefId = { CompanyId: $scope.BankDetail.AccountRefId };
            }
            
        }
        sessionStorage.removeItem("BankDetail");
    }

    function GetAllBankDetails() {
        bankDetailService.GetAllBankDetails().then(function (response) {
            $scope.BankDetailList = response.data;
        }, function () {
            alert("Failed to get Bank Detail!");
        })
    }
    function GetAllCustomers() {
        bankDetailService.GetAllCustomers().then(function (response) {
            $scope.CustomerList = response.data;
        }, function () {
            alert("Failed to get customer!");
        })
    }
    function GetAllCompanies() {
        bankDetailService.GetAllCompanies().then(function (response) {
            $scope.CompanyList = response.data;
        }, function () {
                alert("Failed to get company!");
        })
    }
    function ResetObject() {
        $scope.BankDetail = {};
        $scope.BankDetail.BankId = 0;
        $scope.ddlAccountRefId = null;

    }
    $scope.SetCustomerAccount = function () {
        $scope.BankDetail.AccountForName = "Customer";
    }
    $scope.SetCompanyAccount = function () {
        $scope.BankDetail.AccountForName = "Company";
    }
    $scope.AddBankDetail = function (bankDetail) {
        if ($scope.BankDetail.BankId == 0) {
            $scope.BankDetail.Status = true;
            $scope.BankDetailTempList.push(bankDetail)
            ResetObject();
        }
        else {
            $scope.BankDetailTempList.push(bankDetail);
            $scope.btnSave = 'Add Bank Detail';
            ResetObject();
        }
    }
    $scope.AddNew = function () {
        window.location.href = "/BankDetails/Create";
    }
    $scope.SaveBankDetail = function () {
        var bankDetailCount = $scope.BankDetailTempList.length;
        angular.forEach($scope.BankDetailTempList, function (data) {
            if (data.BankId == 0) {
                bankDetailService.SaveBankDetail(data).then(function (response) {
                    bankDetailCount--;
                    if (bankDetailCount == 0) {
                        alert("Bank Detail Saved Successfully");
                        Clear();
                        window.location.href = "/BankDetails/Index";
                    }

                }, function () {
                        Clear();
                    alert("Error occured. Please try again.");

                });
            }
            else {
                bankDetailService.UpdateBankDetail(data).then(function (response) {
                    bankDetailCount--;
                    if (bankDetailCount == 0) {
                        Clear();
                        alert("Bank Detail Update Successfully");
                        window.location.href = "/BankDetails/Index";
                    }

                }, function () {
                        Clear();
                    alert("Error occured. Please try again.");

                });
            }

        });


    }
    $scope.Delete = function (bankDetail) {
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            bankDetailService.DeleteBankDetail(bankDetail).then(function (response) {
                alert("Bank Detail Deleted Successfully");
                Clear();
                window.location.reload();
            }, function () {
                    Clear();
                alert("Error occured. Please try again.");

            });
        } else {
            Clear();
            return;
        }
    }
    $scope.Edit = function (bankDetail) {
        sessionStorage.setItem("BankDetail", JSON.stringify(bankDetail));
        window.location.href = "/BankDetails/Create"
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.RedirectToList = function () {
        window.location.href = "/BankDetails/Index";
    }
    $scope.Remove = function (bankDetail) {
        var index = $scope.BankDetailTempList.indexOf(bankDetail);
        $scope.BankDetailTempList.splice(index, 1);
    }


}])


bankDetailApp.factory('bankDetailService', ['$http', function ($http) {

    var bankDetailAppFactory = {};

    bankDetailAppFactory.GetAllBankDetails = function () {
        return $http.get('/api/BankDetails/AllBankDetails')
    }
    bankDetailAppFactory.SaveBankDetail = function (BankDetail) {
        return $http.post('/api/BankDetails/CreateBankDetail', BankDetail)
    };
    bankDetailAppFactory.UpdateBankDetail = function (BankDetail) {
        return $http.put('/api/BankDetails/UpdateBankDetail/' + BankDetail.BankId, BankDetail)
    };

    bankDetailAppFactory.DeleteBankDetail = function (BankDetail) {
        return $http.post('/api/BankDetails/DeleteBankDetail', BankDetail)
    };
    bankDetailAppFactory.GetAllCustomers = function () {
        return $http.get('/api/Customers/AllCustomers')
    }
    bankDetailAppFactory.GetAllCompanies = function () {
        return $http.get('/api/Companies/AllCompanies')
    }
    return bankDetailAppFactory;

}])

