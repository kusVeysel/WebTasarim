function supplierStatusUp(ID) {
    $.get("/Supplier/SupplierStaUpdate/" + ID, function (result) {
        if (result.Status == true) {
            if (result.Message == "Tedarikçi aktif hale getirildi") {
                toastr.success(result.Message, result.Title);
            }
            else {
                toastr.warning(result.Message, result.Title);
            }
            setTimeout(function () {
                window.location.reload()
            }, 1000);
        }
        else {
            toastr.error(result.Message, result.Title);
        }
    })
}

function supplierUpdate(ID) {
    veri = {
        ID: ID,
        Name: $("#Name").val(),
        Phone: $("#Phone").val(),
        Email: $("#Email").val()
    }
    $.ajax({
        url: "/Supplier/SupplierUpdate",
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.replace("/Supplier/Index");
                }, 1000);
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
        })
}

window.supplierInsert = function() {
    veri = {
        Name: $("#Name").val(),
        Phone: $("#Phone").val(),
        Email: $("#Email").val()
    }
    $.ajax({
        url: "/Supplier/SupplierInsert",
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.replace("/Supplier/Index");
                }, 1000);
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    });
}