function satinAlmaEkle() {
    veri = {
        urunID: $('#productID').val(),
        tedarikciID: $('#tedarikciID').val(),
        adet: $('#adet').val(),
        birimFiyat: $('#birimFiyat').val(),
        toplamFiyat: $('#toplamFiyat').val(),
        kdvOran: $('#kdv').val(),
        satinAlmaTarih: $('#satinAlmaTarih').val()
    }

    $.ajax({
        url: "/SatinAlma/Add",
        type: "post",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setInterval(function () {
                    window.location.replace("/SatinAlma/Index")
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    })
}

function updateSatinAlma(urunID) {
    var satinAlma = {
        urunID: urunID,
        adet: $('#adet').val(),
        birimFiyat: $('#birimFiyat').val(),
        toplamFiyat: $('#toplamFiyat').val(),
        satinAlmaTarih: $('#satinAlmaTarih').val()
    };
    $.ajax({
        url: '/SatinAlma/Update',
        type: 'POST',
        data: satinAlma,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.replace("/SatinAlma/Index")
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    
    });
}