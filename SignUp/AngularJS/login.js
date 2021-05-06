/// <reference path="angular.js" />
var loginApp = angular.module('loginApp', ['LocalStorageModule', 'AuthApp']);

loginApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
})

//loginApp.run(['authService', function (authService) {
//    authService.fillAuthData();
//}])

loginApp.controller('loginController', ['$scope', '$window', 'authService', function ($scope, $window, authService) {
    $scope.init = function () {
        $scope.isProcessing = false;
        $scope.LoginBtnText = "Sign In";
    }

    $scope.init();

    $scope.loginData = {
        userName: "",
        password:""
    }

    $scope.Login = function () {
        $scope.isProcessing = true;
        $scope.LoginBtnText = "Signing in.....";

        authService.login($scope.loginData).then(function (response) {
            alert("Login Successfully");
            $window.location.href = "/Home/Index";
        }, function (error) {
            alert(error.error_description);
            $window.location.href = "/Users/Login";
            $scope.init();
        })
    }
    $scope.Logout = function () {
        debugger;   
        authService.logOut().then(function (response) {
            $window.location.href = "/Users/Login";
        }, function (error) {
            alert(error.error_description);
            $window.location.href = "/Users/Login";
            $scope.init();
        })
    }

    $scope.Cancel = function () {
        $window.location.href = "/Home/Index";
    }
    $('#logoutModal').modal('show');
}])