
///<reference path="angular.js" />
/// <reference path="jquery-2.2.3.min.js" />
/// <reference path="jquery-ui.js" />

var damagedProductApp = angular.module('damagedProductApp', ['LocalStorageModule', 'AuthApp']);

damagedProductApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

damagedProductApp.controller('damagedProductController', ['$scope', '$filter', '$http', 'damagedProductService', function ($scope, $http, $filter, damagedProductService) {


    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.btnSave = 'Add Product';
        $scope.disableBtnAddProduct = true;
        $scope.disDate = true;
        $scope.DamagedProduct = {};
        $scope.DamagedProduct.TotalAmount = 0;
        $scope.DamagedProduct.TotalQuantity = 0;
        $scope.itemQty = 0;
        $scope.productObj = {};
        $scope.DamagedProductList = [];
        $scope.productList = [];
        $scope.AddproductList = [];
        $scope.updateProductList = [];
        GetAllDamagedProduct();
        GetAllProduct();
        LoadDamagedProduct();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }
    $scope.disSave = function () {
        $scope.disDate = false;
    }
    function LoadDamagedProduct() {
        var damagedProduct = sessionStorage.getItem("DamagedProduct");
        if (damagedProduct != null) {
            $scope.btnSave = 'Update Damaged';
            $scope.DamagedProduct = JSON.parse(sessionStorage.DamagedProduct);
            console.log($scope.DamagedProduct);
            GetAllDamagedProductDetail($scope.DamagedProduct);
            var damageddate = new Date($scope.DamagedProduct.DamagedDate);
            $('#damagedDate').val(damageddate.getFullYear() + '-' + ('0' + (damageddate.getMonth() + 1)).slice(-2) + '-' + ('0' + damageddate.getDate()).slice(-2));
           
        }
        sessionStorage.removeItem("DamagedProduct");
    }


    function GetAllDamagedProduct() {
        damagedProductService.GetAllDamagedProduct().then(function (response) {
            $scope.DamagedProductList = response.data;
            console.log($scope.DamagedProductList);

        }, function () {
            alert("Failed to get Order!");
        })
    };
    function GetAllProduct() {
        damagedProductService.GetAllProduct().then(function (response) {
            $scope.productList = response.data;
        }, function () {
            alert("Failed to get Category!");
        })
    }
    
    function GetAllDamagedProductDetail(damagedProduct) {
        damagedProductService.GetAllDamagedProductDetail(damagedProduct).then(function (response) {
            $scope.AddproductList = response.data;
            console.log($scope.AddproductList);

        }, function () {
            alert("Failed to get DamagedProduct Detail!");
        })
    }
    

    $scope.btnDisable = function () {
        

        if ($scope.itemQty == 0 || $scope.itemQty == "" || $scope.itemQty == null) {
            $scope.disableBtnAddProduct = true;
        } else {
            $scope.disableBtnAddProduct = false;
        }
        //if ($scope.itemQty <= $scope.ddlProduct.ProductQty) {
        //    $scope.itemQty = Number($scope.itemQty);
        //} else {
        //    alert("Qty not available in the stock!!! " + $scope.ddlProduct.ProductQty + " " + $scope.ddlProduct.ProductName + " available in the stock!!!");
        //    $scope.itemQty = "";
        //    $scope.disableBtnAddProduct = true;
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

        //for (var i = 0; i < $scope.AddproductList.length; i++) {
        //    if ($scope.AddproductList[i].ProductNo == $scope.ddlProduct.ProductNo) {
        //        alert("Project is Exits!!!");
        //        return;
        //    }
        //}

        $scope.productObj = $scope.ddlProduct;
        $scope.productObjTemp = angular.copy($scope.productObj);
        $scope.productObjTemp.ProductQty = Number($scope.productObjTemp.ProductQty) - Number($scope.itemQty);
        $scope.updateProductList.push($scope.productObjTemp);

        $scope.productObj.ProductQty = parseInt($scope.itemQty);
        $scope.Amount = $scope.productObj.ProductQty * $scope.productObj.OriginalPrice;
        $scope.DamagedProduct.TotalQuantity += $scope.productObj.ProductQty;
        $scope.DamagedProduct.TotalAmount += parseFloat($scope.Amount);

        $scope.AddproductList.push($scope.productObj);
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
    $scope.DamagedProductSave = function () {
        $scope.DamagedProduct.DamagedDate = convert($scope.DamagedProduct.DamagedDate);
        damagedProductService.PostDamagedProduct($scope.DamagedProduct).then(function (response) {
            
            angular.forEach($scope.AddproductList, function (data) {
                data.DamagedId = response.data.DamagedId;
                damagedProductService.PostDamagedProductDetail(data).then(function (response) {
                    damagedProductService.PostProduct($scope.updateProductList).then(function (response) {

                    }, function () {
                        alert("Damaged Product Save Success !!!");
                        window.location.href = "/DamagedProducts/Index";
                    });
                }, function () {
                    alert("Error occured. Please try again.");

                });

            });

        }, function () {
            alert("Error !!!");

        });
    }
    $scope.Delete = function (DamagedProduct) {
        damagedProductService.GetAllDamagedProductDetail(DamagedProduct).then(function (responset) {
            $scope.AddproductList = responset.data;

            damagedProductService.GetAllProduct().then(function (responsep) {
                $scope.productList = responsep.data;
                if ($scope.AddproductList.length > 0 && $scope.productList.length > 0) {
                    angular.forEach($scope.productList, function (datap) {
                        angular.forEach($scope.AddproductList, function (datat) {
                            if (datat.ProductId == datap.ProductId) {

                                datat.ProductNo = datap.ProductNo;
                                datat.Description = datap.Description;
                                datat.CategoryId = datap.CategoryId;
                                datat.ProductQty = datap.ProductQty + datat.ProductQty;
                            }
                        })
                    })
                    var r = confirm("Are you sure you want to delete?");
                    if (r == true) {
                        damagedProductService.PostProduct($scope.AddproductList).then(function (response) {

                        });
                        damagedProductService.DeleteDamagedProduct(DamagedProduct).then(function (response) {
                            alert("Damaged Product Deleted Successfully");
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
            alert("Failed to get DamagedProduct Detail!");
        })


    }
    //$scope.Delete = function (DamagedProduct) {
    //    var r = confirm("Are you sure you want to delete?");
    //    if (r == true) {
    //        damagedProductService.DeleteDamagedProduct(DamagedProduct).then(function (response) {
    //            alert("Damaged Product Deleted Successfully");
    //            window.location.reload();
    //        }, function () {
    //            alert("Error occured. Please try again.");

    //        });
    //    } else {
    //        return;
    //    }

    //}
    function ResetObject() {
        $scope.DamagedProduct = {};
        $scope.DamagedProduct.TotalAmount = 0;
        $scope.DamagedProduct.TotalQuantity = 0;
        $scope.itemQty = 0;
        $scope.ddlProduct = null;
    }
    $scope.ResetObject = function () {
        ResetObject();
    }
    $scope.ResetAll = function () {
        Clear();
    }

    $scope.Edit = function (damagedProduct) {
        sessionStorage.setItem("DamagedProduct", JSON.stringify(damagedProduct));
        window.location.href = "/DamagedProducts/Create"
    }

    $scope.removebtn = function (productObj) {
        if (productObj.DamagedProductDetailId == undefined) {
            $scope.DamagedProduct.TotalQuantity -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.OriginalPrice;
            $scope.DamagedProduct.TotalAmount -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            return;
        }
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            $scope.DamagedProduct.TotalQuantity -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.OriginalPrice;
            $scope.DamagedProduct.TotalAmount -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            damagedProductService.DeleteDamagedProductDetail(productObj).then(function (response) {
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
        window.location.href = "/DamagedProducts/Create";
    }
    $scope.RedirectToList = function () {
        window.location.href = "/DamagedProducts/Index";
    }
}]);


damagedProductApp.factory('damagedProductService', ['$http', '$filter', function ($http, $filter) {

    var damagedProductAppFactory = {};

    damagedProductAppFactory.GetAllDamagedProduct = function () {
        return $http.get('/api/DamagedProducts/GetAllDamagedProduct')
    }
    damagedProductAppFactory.GetAllDamagedProductDetail = function (damagedProduct) {
        return $http.get('/api/DamagedProducts/GetAllDamagedProductDetail/' + damagedProduct.DamagedId)
    }
    damagedProductAppFactory.GetAllProduct = function () {
        return $http.get('/api/Products/GetAllProduct')
    }
    
    damagedProductAppFactory.PostDamagedProduct = function (DamagedProductObj) {
        return $http.post('/api/DamagedProducts/PostDamagedProduct', DamagedProductObj)
    }
    damagedProductAppFactory.PostDamagedProductDetail = function (DamagedProductDetailObj) {
        return $http.post('/api/DamagedProducts/PostDamagedProductDetail', DamagedProductDetailObj)
    }
    damagedProductAppFactory.PostProduct = function (productObj) {
        return $http.post('/api/Products/PostProduct', productObj)
    }
    damagedProductAppFactory.DeleteDamagedProduct = function (DamagedProduct) {
        return $http.post('/api/DamagedProducts/DeleteDamagedProducts', DamagedProduct)
    };
    damagedProductAppFactory.DeleteDamagedProductDetail = function (productObj) {
        return $http.post('/api/DamagedProducts/DeleteDamagedProductDetail', productObj)
    };

    return damagedProductAppFactory;

}])

