function customerStatusUp(ID) {
    $.get("/Customer/CustomerStaUpdate/" + ID, function (result) {
        if (result.Status == true) {
            if (result.Message == "Müşteri aktif hale getirildi") {
                toastr.success(result.Message, result.Title)
            }
            else {
                toastr.warning(result.Message, result.Title)
            }
            setTimeout(function () {
                window.location.reload()
            }, 1000)
        }
        else {
                toastr.error(result.Message, result.Title) 
            
        }
    })
}
function customerUpdate(ID) {
    veri = {
        ID: ID,
        CustomerName: $("#CustomerName").val(),
        phone: $("#phone").val(),
        email: $("#email").val(),
        adres: $("#adres").val(),
        yetkili: $("#yetkili").val(),
    };

    $.ajax({
        url: "/Customer/CustomerUpdate/",
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title)
                setTimeout(function () {
                    window.location.reload()
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title)
            }
        }
    })
}

function Ekle() {
    veri = {
        CustomerName: $("#CustomerName").val(),
        Phone: $("#Phone").val(),
        Email: $("#Email").val(),
        adres: $("#adres").val(),
        yetkili: $("#yetkili").val(),
    };

    $.ajax({
        url: "/Customer/CustomerAdd/",
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title)
                setTimeout(function () {
                    window.location.reload()
                }, 1000)
            }
            else {

                toastr.error(result.Message, result.Title)
            }
        }
    })
}