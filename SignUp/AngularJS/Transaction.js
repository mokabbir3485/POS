
///<reference path="angular.js" />
/// <reference path="jquery-2.2.3.min.js" />
/// <reference path="jquery-ui.js" />

var transactionApp = angular.module('transactionApp', ['LocalStorageModule', 'AuthApp']);

transactionApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

transactionApp.controller('transactionController', ['$scope', '$filter', '$http', '$window', 'transactionService', function ($scope, $http, $filter, $window, transactionService) {


    Clear();
    function Clear() {
        $scope.ddlPage = {};
        $scope.PageList = [{ PageId: 1, PageNo: '10', PageNoShow: '10' }, { PageId: 2, PageNo: '50', PageNoShow: '50' }, { PageId: 3, PageNo: '100', PageNoShow: '100' }, { PageId: 4, PageNo: '500', PageNoShow: '500' }, { PageId: 5, PageNo: '10000000', PageNoShow: 'All' }]
        $scope.ddlPage.PageNo = '10';
        $scope.btnSave = 'Add Product';
        $scope.disableBtnAddProduct = true;
        $scope.disDate = true;
        $scope.disableVat = false;
        $scope.Transaction = {};
        $scope.updateCheck = {};
        $scope.TransactionReport = {};
        $scope.CustomerObj = {};
        $scope.Transaction.SubTotal = 0;
        $scope.Transaction.TransactionQty = 0;
        $scope.discount = 0;
        $scope.itemQty = 0;
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
        LoadTransaction();
    }
    $scope.PrintDoc = function () {
        $('.widget').attr('class', 'forprint green');
        window.print();
        $('.forprint').attr('class', 'widget green');

    }


    function LoadTransaction() {
        var transaction = sessionStorage.getItem("Transaction");
        if (transaction != null) {
            $scope.btnSave = 'Update Transaction';
            $scope.Transaction = JSON.parse(sessionStorage.Transaction);
            console.log($scope.Transaction);
            GetAllTransactionDetail($scope.Transaction);
            var transactiondate = new Date($scope.Transaction.TransactionDate);
            $('#transactionDate').val(transactiondate.getFullYear() + '-' + ('0' + (transactiondate.getMonth() + 1)).slice(-2) + '-' + ('0' + transactiondate.getDate()).slice(-2));
            $scope.Transaction.SubTotal = Number($scope.Transaction.SubTotal);
            GetAllCustomers();
            $scope.ddlCustomer = { CustomerId: $scope.Transaction.CustomerId };
            $scope.ddlBankDetail = { BankId: $scope.Transaction.BankId };
            if ($scope.ddlBankDetail.BankId == null) {
                $scope.PaymentType = 2;
            } else {
                $scope.PaymentType = 1;
            }

        }
        sessionStorage.removeItem("Transaction");
    }
    $scope.disSave = function () {
        $scope.disDate = false;
    }

    function GetAllTransaction() {
        transactionService.GetAllTransaction().then(function (response) {
            $scope.TransactionList = response.data;
            console.log($scope.TransactionList);

        }, function () {
            alert("Failed to get transaction!");
        })
    };
    function GetAllProduct() {
        transactionService.GetAllProduct().then(function (response) {
            $scope.productList = response.data;
        }, function () {
            alert("Failed to get Category!");
        })
    }
    function GetAllCustomers() {
        transactionService.GetAllCustomers().then(function (response) {
            $scope.CustomerList = response.data;
            $scope.Customer = $scope.CustomerList.find(cust => cust.CustomerId === $scope.Transaction.CustomerId);
        }, function () {
            alert("Failed to get customer!");
        })
    }
    function GetAllBankDetails() {
        transactionService.GetAllBankDetails().then(function (response) {
            $scope.BankDetailList = response.data;
        }, function () {
            alert("Failed to get Bank Detail!");
        })
    }
    function GetAllTransactionDetail(transaction) {
        transactionService.GetAllTransactionDetail(transaction).then(function (response) {
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

    function vat() {
        $scope.percentVat = ($scope.Transaction.TransVat / 100) * $scope.Transaction.SubTotal;
        $scope.Transaction.TotalAmount = Number($scope.Transaction.SubTotal) + Number($scope.percentVat);
    }

    function dis() {
        $scope.percentDiscount = ($scope.Transaction.TransDiscount / 100) * $scope.Transaction.SubTotal;
        $scope.Transaction.TotalAmount = Number($scope.Transaction.SubTotal) - Number($scope.percentDiscount);

    }


    $scope.CalculetionForVat = function () {
        $scope.percentVat = ($scope.Transaction.TransVat / 100) * $scope.Transaction.SubTotal;
        if ($scope.Transaction.TransDiscount > 0) {
            dis();
            $scope.Transaction.TotalAmount = Number($scope.Transaction.TotalAmount) + Number($scope.percentVat);
        } else {
            $scope.Transaction.TotalAmount = Number($scope.Transaction.SubTotal) + Number($scope.percentVat);

        }
    }
    $scope.CalculetionForDiscount = function () {
        if ($scope.Transaction.TransDiscount > 0) {
            $scope.disableVat = true;
        } else {
            $scope.disableVat = false;
        }
        $scope.percentDiscount = ($scope.Transaction.TransDiscount / 100) * $scope.Transaction.SubTotal;
        if ($scope.Transaction.TransVat > 0) {
            vat();
            $scope.Transaction.TotalAmount = Number($scope.Transaction.TotalAmount) - Number($scope.percentDiscount);
        } else {
            $scope.Transaction.TotalAmount = Number($scope.Transaction.SubTotal) - Number($scope.percentDiscount);
        }
    }
    $scope.changedAmountCal = function () {

        $scope.Transaction.Change = Number($scope.Transaction.TenderedAmount) - Number($scope.Transaction.TotalAmount);
        if ($scope.Transaction.Change < 0) {
            $scope.Transaction.Due = Math.abs($scope.Transaction.Change);
        } else {
            $scope.Transaction.Due = 0;
        }
        if ($scope.Transaction.Change <= 0) {
            $scope.Transaction.Change = 0;
        }
    }

    $scope.btnDisable = function () {
        if ($scope.itemQty == 0 || $scope.itemQty == "" || $scope.itemQty == null) {
            $scope.disableBtnAddProduct = true;
        } else {
            $scope.disableBtnAddProduct = false;
        }

        if ($scope.itemQty <= $scope.ddlProduct.ProductQty) {
            $scope.itemQty = Number($scope.itemQty);
        } else {
            alert("Qty not available in the stock!!! " + $scope.ddlProduct.ProductQty + " " + $scope.ddlProduct.ProductName + " available in the stock!!!");
            $scope.itemQty = "";
        }


    }
    $scope.checkQty = function () {
        if ($scope.ddlProduct.ProductQty < 6) {
            alert($scope.ddlProduct.ProductQty + " " + $scope.ddlProduct.ProductName + " is vary low qty in the stock!!!");
        }
    }

    $scope.addProduct = function () {
        $scope.productObj = $scope.ddlProduct;
        for (var i = 0; i < $scope.AddproductList.length; i++) {
            if ($scope.AddproductList[i].ProductNo == $scope.ddlProduct.ProductNo) {
                alert("Product is Exits!!!");
                return;
            }
        }
        $scope.productObjTemp = angular.copy($scope.productObj);
        $scope.productObjTemp.ProductQty = Number($scope.productObjTemp.ProductQty) - Number($scope.itemQty);
        $scope.updateProductList.push($scope.productObjTemp);

        $scope.productObj.ProductQty = parseInt($scope.itemQty);
        $scope.Transaction.TransactionDate = convert($scope.Transaction.TransactionDate);
        $scope.productObj.TransactionDate = $scope.Transaction.TransactionDate;
        $scope.AddproductList.push($scope.productObj);

        //angular.forEach($scope.AddproductList, function (data) {
        //    $scope.Amount = data.ProductQty * data.MarkupPrice;
        //    $scope.Transaction.TransactionQty += data.ProductQty;
        //    $scope.Transaction.SubTotal += parseFloat($scope.Amount);
        //})
        $scope.Amount = $scope.productObj.ProductQty * $scope.productObj.MarkupPrice;
        $scope.Transaction.TransactionQty += $scope.productObj.ProductQty;
        $scope.Transaction.SubTotal += parseFloat($scope.Amount);
        $scope.Transaction.TotalAmount = $scope.Transaction.SubTotal;


        $scope.productObj = {};
        $scope.productObjTemp = {};
        $scope.itemQty = 0;
        $scope.Transaction.TransVat = '';
        $scope.Transaction.TransDiscount = '';
        //$scope.Transaction.TotalAmount = '';
        $scope.disableBtnAddProduct = true;
    }

    //$scope.addProduct = function () {
    //    $scope.productObj = $scope.ddlProduct;
    //    $scope.productObjTemp = angular.copy($scope.productObj);
    //    $scope.productObjTemp.ProductQty = Number($scope.productObjTemp.ProductQty) - Number($scope.itemQty);
    //    $scope.updateProductList.push($scope.productObjTemp);

    //    $scope.productObj.ProductQty = parseInt($scope.itemQty);
    //    $scope.productObj.TransactionDate = $scope.Transaction.TransactionDate;

    //    $scope.Amount = $scope.productObj.ProductQty * $scope.productObj.MarkupPrice;
    //    $scope.Transaction.TransactionQty += $scope.productObj.ProductQty;
    //    $scope.Transaction.SubTotal += parseFloat($scope.Amount);

    //    $scope.AddproductList.push($scope.productObj);
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
    $scope.TransactionSave = function () {
        if ($scope.ddlCustomer != undefined) {
            $scope.Transaction.CustomerId = $scope.ddlCustomer.CustomerId;
            if ($scope.Customer == undefined) {
                $scope.CustomerObj = $scope.ddlCustomer;
            } else {
                $scope.CustomerObj = $scope.Customer;
            }


            $scope.CustomerObj.Due += $scope.Transaction.Due;
        }

        $scope.Transaction.TransactionDate = convert($scope.Transaction.TransactionDate);

        $scope.Transaction.TransVatAmount = parseFloat($scope.percentVat);
        $scope.Transaction.TransDiscountAmount = parseFloat($scope.percentDiscount);
        transactionService.PostTransaction($scope.Transaction).then(function (response) {
            var productCount = $scope.AddproductList.length;
            angular.forEach($scope.AddproductList, function (data) {
                data.TransactionId = response.data.TransactionId;
                transactionService.PostTransactionDetail(data).then(function (response) {
                    transactionService.PostProduct($scope.updateProductList).then(function (response) {

                    }, function () {
                        productCount--;
                        if (productCount == 0) {
                            if ($scope.ddlCustomer != null || $scope.ddlCustomer != undefined) {
                                transactionService.UpdateCustomer($scope.CustomerObj).then(function (response) {
                                    alert("Transaction Save Success !!!");
                                    window.location.href = "/Transactions/Index";

                                }, function () {
                                    alert("Error occured. Please try again.");

                                });
                            }
                            alert("Transaction Save Success !!!");
                            window.location.href = "/Transactions/Index";
                        }
                    });
                }, function () {
                    alert("Error occured. Please try again.");

                });

            });

        }, function () {
            alert("Error !!!");

        });
    }

    $scope.Delete = function (Transaction) {
        transactionService.GetAllTransactionDetail(Transaction).then(function (responset) {
            $scope.AddproductList = responset.data;

            transactionService.GetAllProduct().then(function (responsep) {
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
                        transactionService.PostProduct($scope.AddproductList).then(function (response) {
                            
                        });
                        transactionService.DeleteOrder(Transaction).then(function (response) {
                            alert("Transaction Deleted Successfully");
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
            alert("Failed to get Transaction Detail!");
        })
        

    }
    //$scope.Delete = function (Transaction) {
    //    var r = confirm("Are you sure you want to delete?");
    //    if (r == true) {
    //        transactionService.DeleteOrder(Transaction).then(function (response) {
    //            alert("Transaction Deleted Successfully");
    //            window.location.reload();
    //        }, function () {
    //            alert("Error occured. Please try again.");

    //        });
    //    } else {
    //        return;
    //    }

    //}
    function ResetObject() {
        Clear();
    }
    $scope.ResetObject = function () {
        ResetObject();
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
    $scope.removebtn = function (productObj) {
        if (productObj.TransactionDetailId == undefined) {
            $scope.Transaction.TotalAmount = 0;
            $scope.Transaction.TransVat = "";
            $scope.Transaction.TransDiscount = "";
            $scope.disableVat = false;

            $scope.Transaction.TransactionQty -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.MarkupPrice;
            $scope.Transaction.SubTotal -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            return;
        }
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            $scope.Transaction.TotalAmount = 0;
            $scope.Transaction.TransVat = "";
            $scope.Transaction.TransDiscount = "";
            $scope.disableVat = false;

            $scope.Transaction.TransactionQty -= parseInt(productObj.ProductQty);
            $scope.Amount = productObj.ProductQty * productObj.MarkupPrice;
            $scope.Transaction.SubTotal -= parseFloat($scope.Amount);
            var index = $scope.AddproductList.indexOf(productObj);
            $scope.AddproductList.splice(index, 1);
            transactionService.DeleteTransactionDetail(productObj).then(function (response) {
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
        window.location.href = "/Transactions/Create";
    }
    $scope.RedirectToList = function () {
        window.location.href = "/Transactions/Index";
    }
}]);


transactionApp.factory('transactionService', ['$http', '$filter', function ($http, $filter) {

    var TransactionAppFactory = {};

    TransactionAppFactory.GetAllTransaction = function () {
        return $http.get('/api/Transactions/GetAllTransaction')
    }
    TransactionAppFactory.GetAllTransactionDetail = function (transaction) {
        return $http.get('/api/Transactions/GetAllTransactionDetail/' + transaction.TransactionId)
    }
    TransactionAppFactory.GetAllProduct = function () {
        return $http.get('/api/Products/GetAllProduct')
    }
    TransactionAppFactory.GetAllBankDetails = function () {
        return $http.get('/api/BankDetails/AllBankDetails')
    }
    TransactionAppFactory.GetAllCustomers = function () {
        return $http.get('/api/Customers/AllCustomers')
    }
    TransactionAppFactory.UpdateCustomer = function (Customer) {
        return $http.put('/api/Customers/UpdateCustomer/' + Customer.CustomerId, Customer)
    };
    TransactionAppFactory.PostTransaction = function (TransactionObj) {
        return $http.post('/api/Transactions/PostTransaction', TransactionObj)
    }
    TransactionAppFactory.PostTransactionDetail = function (TransactionDetailObj) {
        return $http.post('/api/Transactions/PostTransactionDetail', TransactionDetailObj)
    }
    TransactionAppFactory.PostProduct = function (productObj) {
        return $http.post('/api/Products/PostProduct', productObj)
    }
    TransactionAppFactory.DeleteOrder = function (Transaction) {
        return $http.post('/api/Transactions/DeleteTransactions', Transaction)
    };
    TransactionAppFactory.DeleteTransactionDetail = function (productObj) {
        return $http.post('/api/Transactions/DeleteTransactionDetails', productObj)
    };

    return TransactionAppFactory;

}])

