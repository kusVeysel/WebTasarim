function updateSize(ID) {
    veri = {
        ID: ID,
        SizeName: $("#SizeName").val()
    }
    $.ajax({
        url: "/Setup/SizeUpdate/" + ID,
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    });
}

function SizeAdd() {
    veri = {
        SizeName: $("#SizeName").val()
    }
    $.ajax({
        url: "/Setup/SizeAdd",
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    });
}

function updateCategory(ID) {
    veri = {
        ID: ID,
        CategoryName: $("#CategoryName").val()
    }
    $.ajax({
        url: "/Setup/CategoryUpdate/" + ID,
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    });
}

function CategoryAdd() {
    veri = {
        CategoryName: $("#CategoryName").val()
    }
    $.ajax({
        url: "/Setup/CategoryAdd",
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    });
}

function updateMaterial(ID) {
    veri = {
        ID: ID,
        MaterialName: $("#MaterialName").val()
    }
    $.ajax({
        url: "/Setup/MaterialUpdate/" + ID,
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    });
}

function MaterialAdd() {
    veri = {
        MaterialName: $("#MaterialName").val()
    }
    $.ajax({
        url: "/Setup/MaterialAdd",
        type: "POST",
        data: veri,
        success: function (result) {
            if (result.Status == true) {
                toastr.success(result.Message, result.Title);
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
            }
            else {
                toastr.error(result.Message, result.Title);
            }
        }
    });
}
