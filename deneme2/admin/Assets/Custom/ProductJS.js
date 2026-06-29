function productStaUpdate(ID) { 
    $.get("/Product/ProductStaUpdate/" + ID, function (result) { // get ile "/Product/ProductStaUpdate/"+ID'ye istek gönderir
        if (result.Status == true) {
            toastr.success(result.Message, result.Title); // toastr ile başarılı mesajı gösterir
            setTimeout(function () { // 2 saniye sonra sayfayı yeniler
                window.location.reload()
            }, 1000)
        }
        else { 
            if (result.Title == 'Hata') { 
                toastr.error(result.Message, result.Title) // toastr ile hata mesajı gösterir
            }
            else { 
                toastr.error(result.Message, result.Title) // toastr ile hata mesajı gösterir
                setTimeout(function () { // 2 saniye sonra sayfayı yeniler
                    window.location.reload()
                }, 1000)
            }
        }
    })
}
function getProductStockInfo(ID) {
    $.get("/Product/GetProductInfo/" + ID, function (result) { // get ile "/Product/GetProductInfo/"+ID'ye istek gönderir
        $('#stockID').val(result.ID);
        $('#productID').val(result.ProductID);
        $('#productName').html("Güncellenecek Ürün: " + result.ProductName)
        $('#stock').val(result.Stock);
        $('#alarmStock').val(result.AlarmStock);
    })
}

function updateStock() {
    veri = {
        ID: $('#stockID').val(),
        ProductID: $('#productID').val(),
        Stock: $('#stock').val(),
        AlarmStock: $('#alarmStock').val()
    } // veri adında bir nesne oluşturur ve formdaki güncellenecek değerleri alır

    $.ajax({ // ajax: actionresult-jsonresult ilişkisindeki jsonresult gibidir, bir şey döndürür ,bir eylem gerçekleştirir
        url: "/Product/StockUpdate",
        type: "post",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.replace("/Product/Index")
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title)
            }
        }
    })
}
function updateProduct() {
    veri = {
        ID: $('#ID').val(),
        productName: $('#productName').val(),
        materialInfo: $('#materialInfo').val(),
        sizeInfo: $('#sizeInfo').val(),
        description: $('#description').val(),
        isActive: $('#isActive').is(':checked')
    }

    $.ajax({
        url: "/Product/Update",
        type: "post",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title)
                setTimeout(function () {
                    window.location.replace("/Product/Index")
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title)
            }
        }
    })
}