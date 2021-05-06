///<reference path="angular.js" />

var categoryApp = angular.module('categoryApp', ['LocalStorageModule', 'AuthApp']);

categoryApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

categoryApp.controller('categoryController', ['$scope', 'categoryService', function ($scope, categoryService) {

    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.Category = {};
        $scope.btnSave = 'Add Category';
        $scope.Category.CategoryId = 0;
        $scope.CategoryList = [];
        $scope.CategoryTempList = [];
        GetAllCategorys();
        LoadCategory();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }
    function LoadCategory() {
        var category = sessionStorage.getItem("Category");
        if (category != null) {
            $scope.btnSave = 'Update Category';
            $scope.Category = JSON.parse(sessionStorage.Category);
        }
        sessionStorage.removeItem("Category");
    }

    function GetAllCategorys() {
        categoryService.GetAllCategorys().then(function (response) {
            $scope.CategoryList = response.data;
        }, function () {
            alert("Failed to get Category!");
        })
    }

    function ResetObject() {
        $scope.Category = {};
        $scope.Category.CategoryId = 0;
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.Edit = function (category) {
        sessionStorage.setItem("Category", JSON.stringify(category));
        window.location.href = "/Categorys/Create"
    }
    $scope.Delete = function (category) {
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            categoryService.DeleteCategory(category).then(function (response) {
                alert("Category Deleted Successfully");
                window.location.reload();
            }, function () {
                alert("Error occured. Please try again.");

            });
        } else {
            return;
        }
    }
    $scope.AddCategory = function (category) {
        if ($scope.Category.CategoryId == 0) {
            $scope.Category.Status = true;
            $scope.CategoryTempList.push(category)
            ResetObject();
        }
        else {
            $scope.CategoryTempList.push(category);
            $scope.btnSave = 'Add Category';
            ResetObject();
        }
    }
    $scope.AddNew = function () {
        window.location.href = "/Categorys/Create";
    }
    $scope.RedirectToList = function () {
        window.location.href = "/Categorys/Index";
    }
    $scope.SaveCategorys = function () {
        var categoryCount = $scope.CategoryTempList.length;
        angular.forEach($scope.CategoryTempList, function (data) {
            if (data.CategoryId == 0) {
                categoryService.SaveCategorys(data).then(function (response) {
                    categoryCount--;
                    if (categoryCount == 0) {
                        alert("Category Saved Successfully");
                        window.location.href = "/Categorys/Index";
                    }

                }, function () {
                    alert("Error occured. Please try again.");

                });
            }
            else {
                categoryService.UpdateCategory(data).then(function (response) {
                    categoryCount--;
                    if (categoryCount == 0) {
                        alert("Category Update Successfully");
                        window.location.href = "/Categorys/Index";
                    }

                }, function () {
                    alert("Error occured. Please try again.");

                });
            }

        });


    }
    $scope.Remove = function (category) {
        var index = $scope.CategoryTempList.indexOf(category);
        $scope.CategoryTempList.splice(index, 1);
    }


}])


categoryApp.factory('categoryService', ['$http', function ($http) {

    var catagoryAppFactory = {};

    catagoryAppFactory.GetAllCategorys = function () {
        return $http.get('/api/Categorys/AllCategorys')
    }

    catagoryAppFactory.SaveCategorys = function (Category) {
        return $http.post('/api/Categorys/CreateCategory', Category)
    };

    catagoryAppFactory.UpdateCategory = function (Category) {
        return $http.put('/api/Categorys/UpdateCategory/' + Category.CategoryId, Category)
    };

    catagoryAppFactory.DeleteCategory = function (Category) {
        return $http.post('/api/Categorys/DeleteCategory', Category)
    };

    return catagoryAppFactory;

}])