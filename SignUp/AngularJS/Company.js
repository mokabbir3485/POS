///<reference path="angular.js" />

var companyApp = angular.module('companyApp', ['LocalStorageModule', 'AuthApp']);

companyApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

companyApp.controller('companyController', ['$scope', 'companyService', function ($scope, companyService) {
    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';

        $scope.Company = {};
        $scope.btnSave = 'Add Company';
        $scope.Company.CompanyId = 0;
        $scope.CompanyList = [];
        $scope.CompanyTempList = [];
        GetAllCompanies();
        LoadCompany();
    }
    $scope.PrintDoc = function () {
        window.print();

    }
    function LoadCompany() {
        var company = sessionStorage.getItem("Company");
        if (company != null) {
            $scope.btnSave = 'Update Company';
            $scope.Company = JSON.parse(sessionStorage.Company);
        }
        sessionStorage.removeItem("Company");
    }

    function GetAllCompanies() {
        companyService.GetAllCompanies().then(function (response) {
            $scope.CompanyList = response.data;
        }, function () {
            alert("Failed to get company!");
        })
    }
    $scope.AddCompany = function (company) {
        if ($scope.Company.CompanyId == 0) {
            if ($scope.Company.CompanyAddress == undefined || $scope.Company.CompanyAddress == "") {
                $scope.Company.CompanyAddress = "Undefined";
            }
            if ($scope.Company.FactoryAddress == undefined || $scope.Company.FactoryAddress == "") {
                $scope.Company.FactoryAddress = "Undefined";
            }
            $scope.Company.Status = true;
            $scope.CompanyTempList.push(company)
            ResetObject();
        }
        else {
            $scope.CompanyTempList.push(company);
            $scope.btnSave = 'Add Company';
            ResetObject();
        }
    }
    $scope.Remove = function (company) {
        var index = $scope.CompanyTempList.indexOf(company);
        $scope.CompanyTempList.splice(index, 1);
    }
    $scope.SaveCompanies = function () {
        var companyCount = $scope.CompanyTempList.length;
        angular.forEach($scope.CompanyTempList, function (data) {
            if (data.CompanyId == 0) {
                companyService.SaveCompanies(data).then(function (response) {
                    companyCount--;
                    if (companyCount == 0) {
                        alert("Company Saved Successfully");
                        window.location.href = "/Companies/Index";
                    }

                }, function () {
                    alert("Error occured. Please try again.");

                });
            }
            else {
                companyService.UpdateCompany(data).then(function (response) {
                    companyCount--;
                    if (companyCount == 0) {
                        alert("Company Update Successfully");
                        window.location.href = "/Companies/Index";
                    }

                }, function () {
                    alert("Error occured. Please try again.");

                });
            }

        });


    }
    $scope.Delete = function (company) {
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            companyService.DeleteCompany(company).then(function (response) {
                alert("Company Deleted Successfully");
                window.location.reload();
            }, function () {
                alert("Error occured. Please try again.");

            });
        } else {
            return;
        }
    }
    $scope.Edit = function (company) {
        sessionStorage.setItem("Company", JSON.stringify(company));
        window.location.href = "/Companies/Create"
    }
    function ResetObject() {
        $scope.Company = {};
        $scope.Company.CompanyId = 0;
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.AddNew = function () {
        window.location.href = "/Companies/Create";
    }
    $scope.RedirectToList = function () {
        window.location.href = "/Companies/Index";
    }
}])


companyApp.factory('companyService', ['$http', function ($http) {

    var companyAppFactory = {};

    companyAppFactory.GetAllCompanies = function () {
        return $http.get('/api/Companies/AllCompanies')
    }
    companyAppFactory.SaveCompanies = function (Company) {
        return $http.post('/api/Companies/CreateCompany', Company)
    };
    companyAppFactory.UpdateCompany = function (Company) {
        return $http.put('/api/Companies/UpdateCompany/' + Company.CompanyId, Company)
    };
    companyAppFactory.DeleteCompany = function (Company) {
        return $http.post('/api/Companies/DeleteCompany', Company)
    };

    return companyAppFactory;

}])