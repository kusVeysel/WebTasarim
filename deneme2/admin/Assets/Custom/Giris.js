function Giris() {
    veri = {
        sifre: $('#sifre').val(),
        kullanici: $('#kullanici').val()
    };

    $.ajax({
        data: veri,
        type: "POST",
        url: "/Home/Giris",
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                $('#sifre').css("border", "2px solid green");
                $('#kullanici').css("border", "2px solid green");
                $('#kullanicietiket').css("color", "green");
                $('#sifreetiket').css("color", "green");
                setTimeout(function () {
                    window.location.replace("/Home/Index");
                }, 1000);
            }
            else {
                if (result.Message == "Şifre ya da kullanıcı adı hatalı") {
                    toastr.error(result.Message, result.Title);
                }
                else {
                    toastr.warning(result.Message, result.Title);
                }
                $('#sifre').css("border", "2px solid red");
                $('#kullanici').css("border", "2px solid red");
                $('#kullanicietiket').css("color", "red");
                $('#sifreetiket').css("color", "red");
            }
        }
    });
}

