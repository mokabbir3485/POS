///<reference path="angular.js" />

var expenseApp = angular.module('expenseApp', ['LocalStorageModule', 'AuthApp']);

expenseApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

expenseApp.controller('expenseController', ['$scope', 'expenseService', function ($scope, expenseService) {


    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.Expense = {};
        $scope.Expense.ExpenseId = 0;
        $scope.btnSave = 'Add Expense';
        $scope.ExpenseList = [];
        $scope.ExpenseTempList = [];
        $scope.OrderList = [];
        $scope.ddlOrder = {};
        GetAllExpenses();
        LoadExpense();
        GetAllOrders();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }
    function LoadExpense() {
        var expense = sessionStorage.getItem("Expense");
        if (expense != undefined && expense != null) {
            $scope.btnSave = 'Update Expense';
            $scope.Expense = JSON.parse(sessionStorage.Expense);
            var expenseDate = new Date($scope.Expense.ExpenseDate);
            $('#expenseDate').val(expenseDate.getFullYear() + '-' + ('0' + (expenseDate.getMonth() + 1)).slice(-2) + '-' + ('0' + expenseDate.getDate()).slice(-2));
            $scope.ExpenseType = $scope.Expense.ExpenseType;
            if ($scope.Expense.ExpenseType == 'Orders') {
                $scope.ExpenseType = 2;
                $scope.ddlOrder = { OrdedrId: $scope.Expense.OrdedrId };
            } else {
                $scope.ExpenseType = 1;
            }
        }
        sessionStorage.removeItem("Expense");
    }

    $scope.getOrderDate = function () {
        var expenseDate = new Date($scope.Expense.ExpenseDate);
        $('#expenseDate').val(expenseDate.getFullYear() + '-' + ('0' + (expenseDate.getMonth() + 1)).slice(-2) + '-' + ('0' + expenseDate.getDate()).slice(-2));
    }

    function GetAllExpenses() {
        expenseService.GetAllExpenses().then(function (response) {
            $scope.ExpenseList = response.data;
        }, function () {
            alert("Failed to get Expenses!");
        })
    }
    function GetAllOrders() {
        expenseService.GetAllOrders().then(function (response) {
            $scope.OrderList = response.data;
            console.log($scope.OrderList);

        }, function () {
            alert("Failed to get Order!");
        })
    };
    
    function ResetObject() {
        $scope.Expense = {};
        $scope.Expense.ExpenseId = 0;

    }
    $scope.SetExpenseTypeOrders = function () {
        $scope.Expense.ExpenseType = "Orders";
    }
    $scope.SetExpenseTypeOthers = function () {
        $scope.Expense.ExpenseType = "Others";
    }
    $scope.AddExpense = function (expense) {
        if ($scope.Expense.ExpenseId == 0) {
            var ExpenseId = $scope.Expense.ExpenseId;
            $scope.Expense.Status = true;
            $scope.ExpenseTempList.push(expense);
            ResetObject();
        }
        else {
            $scope.ExpenseTempList.push(expense);
            $scope.btnSave = 'Add Expense';
            ResetObject();
        }
    }
    $scope.AddNew = function () {
        window.location.href = "/Expenses/Create";
    }
    function convert(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    $scope.SaveExpense = function () {
        var expenseCount = $scope.ExpenseTempList.length;
        angular.forEach($scope.ExpenseTempList, function (data) {
            data.ExpenseDate = convert(data.ExpenseDate);
            console.log(data.ExpenseDate);
            if (data.ExpenseId == 0) {
                expenseService.SaveExpense(data).then(function (response) {
                    expenseCount--;
                    if (expenseCount == 0) {
                        alert("Expense Saved Successfully");
                        Clear();
                        window.location.href = "/Expenses/Index";
                    }

                }, function () {
                    Clear();
                    alert("Error occured. Please try again.");

                });
            }
            else {
                expenseService.UpdateExpense(data).then(function (response) {
                    expenseCount--;
                    if (expenseCount == 0) {
                        Clear();
                        alert("Expense Update Successfully");
                        window.location.href = "/Expenses/Index";
                    }

                }, function () {
                    Clear();
                    alert("Error occured. Please try again.");

                });
            }

        });


    }
    $scope.Delete = function (expense) {
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            expenseService.DeleteExpense(expense).then(function (response) {
                alert("Expense Deleted Successfully");
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
    $scope.Edit = function (expense) {
        sessionStorage.setItem("Expense", JSON.stringify(expense));
        window.location.href = "/Expenses/Create"
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.RedirectToList = function () {
        window.location.href = "/Expenses/Index";
    }
    $scope.Remove = function (expense) {
        var index = $scope.ExpenseList.indexOf(expense);
        $scope.ExpenseList.splice(index, 1);
    }


}])


expenseApp.factory('expenseService', ['$http', function ($http) {

    var expenseAppFactory = {};

    expenseAppFactory.GetAllExpenses = function () {
        return $http.get('/api/Expenses/AllExpenses')
    }
    expenseAppFactory.SaveExpense = function (Expense) {
        return $http.post('/api/Expenses/CreateExpense', Expense)
    };
    expenseAppFactory.UpdateExpense = function (Expense) {
        return $http.put('/api/Expenses/UpdateExpense/' + Expense.ExpenseId, Expense)
    };

    expenseAppFactory.DeleteExpense = function (Expense) {
        return $http.post('/api/Expenses/DeleteExpense', Expense)
    };
    expenseAppFactory.GetAllOrders = function () {
        return $http.get('/api/Orders/GetAllOrder')
    }
    
    return expenseAppFactory;

}])

