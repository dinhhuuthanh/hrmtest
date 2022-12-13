$(document).on('click', '.unpublish-item', function() {
    var itemId = $(this).data("item-unpublish-id");
    $('#item-id').val(itemId);

    //check referral company join default job
    var joinDefaultCount = $(this).data("join-default-counts");
    if (joinDefaultCount > 0) {
        $('#modal-unpublish').find('.modal-title').text(config.TITLE_WARNING);
        $('.mess-warning').text(config.REF_COMP_JOIN_DEFAULT_JOB).show();
        $('.mess-unpublish').hide();
        $('.footer-unpublish').hide();
        $('#modal-unpublish').modal('show');

        return false;
    }

    $('.mess-unpublish').show();

    // check referral company join to job
    var joinCount = $(this).data("join-counts");
    if (joinCount > 0) {
        $('.mess-warning').text(config.REF_COMP_JOIN_JOB).show();
        $('#modal-unpublish').find('.modal-title').text(config.TITLE_WARNING);
    } else {
        $('#modal-unpublish').find('.modal-title').text(config.TITLE_CONFIRM);
        $('.mess-warning').hide();
    }
    $('.footer-unpublish').show();
    $('#modal-unpublish').modal('show');
});

$(document).on('click', '.publish-item', function() {
    var itemId = $(this).data("item-publish-id");
    $('#item-id').val(itemId);
    $('#modal-publish').modal('show');
});

$(document).on('click', '.signed-item', function() {
    var itemId = $(this).data("item-sign-id");
    var signStatus = $(this).data("item-sign-status");
    $('#item-id').val(itemId);
    $('#item-sign-status').val(signStatus);
    $('#modal-signed').modal('show');
});

$(document).on('click', '.unsigned-item', function() {
    var itemId = $(this).data("item-sign-id");
    var signStatus = $(this).data("item-sign-status");
    $('#item-id').val(itemId);

    //check referral company join default job
    var joinDefaultCount = $(this).data("join-default-counts");
    if (joinDefaultCount > 0) {
        $('#modal-unsigned').find('.modal-title').text(config.TITLE_WARNING);
        $('.mess-warning').text(config.REF_COMP_UNSIGNED_DEFAULT_JOB).show();
        $('.mess-unsigned').hide();
        $('.footer-unsigned').hide();
        $('#modal-unsigned').modal('show');

        return false;
    }
    $('#item-sign-status').val(signStatus);
    $('#modal-unsigned').find('.modal-title').text(config.TITLE_CONFIRM);
    $('.mess-unsigned').show();
    $('.mess-warning').hide();
    $('.footer-unsigned').show();
    $('#modal-unsigned').modal('show');
});

$(document).on('click', '.create-password', function() {
    var itemId = $(this).data("item-id");
    $('#item-id').val(itemId);
    $('#modal-create-password').modal('show');
});

$(document).on('click', '#publish-edit-button', function() {
    $('#modal-publish-edit').modal('show');
});

$(document).on('click', '#action-unpublish', function() {
    unpublishItemById();
});

$(document).on('click', '#action-publish', function() {
    publishById();
});

$(document).on('click', '#action-publish-edit', function() {
    publish();
});

$(document).on('click', '#action-signed', function() {
    signItemById();
});

$(document).on('click', '#action-unsigned', function() {
    unsignedItemById();
});

$(document).on('click', '#action-create-password', function() {
    createPasswordById();
});

window.unpublishItemById = function () {
    $('#action-unpublish').prop('disabled',true);
    var itemId = $('#item-id').val();
    var _token = $('input[name="_token"]').val();
    $.ajax({
        url: unpublishItemUrl,
        method: "POST",
        data: {
            id: itemId,
            _token: _token
        },
        success: function (data) {
            $('#action-unpublish').prop('disabled',false);
            $('#modal-unpublish').modal('hide');
            if(data.success == true){
                toastr.success(data.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (data.success == false) {
                toastr.error(data.message, '', {timeOut: 3000});
            }
        },
        error: function (data) {
            $('#action-unpublish').prop('disabled',false);
            $('#modal-unpublish').modal('hide');
            if (typeof data.responseJSON.errors !== 'undefined') {
                // input error
                errorStr = '';
                $.each(data.responseJSON.errors, function (key, value) {
                    errorStr += value + '<br>';
                });
                toastr.error(errorStr, '', {timeOut: 3000});
            } else if (typeof data.responseJSON.message !== 'undefined') {
                // system error
                toastr.error(data.responseJSON.message, '', {timeOut: 3000});
            } else {
                toastr.error(data.message, '', {timeOut: 3000});
            }
            $('html,body').scrollTop(0, 0);
        }
    });
};

window.publishById = function () {
    $('#action-publish').prop('disabled',true);
    var itemId = $('#item-id').val();
    var _token = $('input[name="_token"]').val();
    $.ajax({
        url: publishItemUrl,
        method: "POST",
        data: {
            id: itemId,
            _token: _token
        },
        success: function (data) {
            $('#action-publish').prop('disabled',false);
            $('#modal-publish').modal('hide');
            if(data.success == true){
                toastr.success(data.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (data.success == false) {
                toastr.error(data.message, '', {timeOut: 3000});
            }
        },
        error: function (data) {
            $('#action-publish').prop('disabled',false);
            $('#modal-publish').modal('hide');
            if (typeof data.responseJSON.errors !== 'undefined') {
                // input error
                errorStr = '';
                $.each(data.responseJSON.errors, function (key, value) {
                    errorStr += value + '<br>';
                });
                toastr.error(errorStr, '', {timeOut: 3000});
            } else if (typeof data.responseJSON.message !== 'undefined') {
                // system error
                toastr.error(data.responseJSON.message, '', {timeOut: 3000});
            } else {
                toastr.error(data.message, '', {timeOut: 3000});
            }
            $('html,body').scrollTop(0, 0);
        }
    });
};

window.signItemById = function () {
    $('#action-signed').prop('disabled',true);
    var itemId = $('#item-id').val();
    var signStatus = $('#item-sign-status').val();
    var _token = $('input[name="_token"]').val();
    $.ajax({
        url: signedUrl,
        method: "POST",
        data: {
            id: itemId,
            sign_status: signStatus,
            _token: _token
        },
        success: function (data) {
            $('#action-signed').prop('disabled',false);
            $('#modal-signed').modal('hide');
            if(data.success == true){
                toastr.success(data.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (data.success == false) {
                toastr.error(data.message, '', {timeOut: 3000});
            }
        },
        error: function (data) {
            $('#action-signed').prop('disabled',false);
            $('#modal-signed').modal('hide');
            if (typeof data.responseJSON.errors !== 'undefined') {
                // input error
                errorStr = '';
                $.each(data.responseJSON.errors, function (key, value) {
                    errorStr += value + '<br>';
                });
                toastr.error(errorStr, '', {timeOut: 3000});
            } else if (typeof data.responseJSON.message !== 'undefined') {
                // system error
                toastr.error(data.responseJSON.message, '', {timeOut: 3000});
            } else {
                toastr.error(data.message, '', {timeOut: 3000});
            }
            $('html,body').scrollTop(0, 0);
        }
    });
};

window.unsignedItemById = function () {
    $('#action-unsigned').prop('disabled',true);
    var itemId = $('#item-id').val();
    var signStatus = $('#item-sign-status').val();
    var _token = $('input[name="_token"]').val();
    $.ajax({
        url: signedUrl,
        method: "POST",
        data: {
            id: itemId,
            sign_status: signStatus,
            _token: _token
        },
        success: function (data) {
            $('#action-unsigned').prop('disabled',false);
            $('#modal-unsigned').modal('hide');
            if(data.success == true){
                toastr.success(data.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (data.success == false) {
                toastr.error(data.message, '', {timeOut: 3000});
            }
        },
        error: function (data) {
            $('#action-unsigned').prop('disabled',false);
            $('#modal-unsigned').modal('hide');
            if (typeof data.responseJSON.errors !== 'undefined') {
                // input error
                errorStr = '';
                $.each(data.responseJSON.errors, function (key, value) {
                    errorStr += value + '<br>';
                });
                toastr.error(errorStr, '', {timeOut: 3000});
            } else if (typeof data.responseJSON.message !== 'undefined') {
                // system error
                toastr.error(data.responseJSON.message, '', {timeOut: 3000});
            } else {
                toastr.error(data.message, '', {timeOut: 3000});
            }
            $('html,body').scrollTop(0, 0);
        }
    });
};

window.publish = function () {
    $('<input>').attr({
        type: 'hidden',
        name: 'is_publish',
        value: true
    }).appendTo('form');
    $("form").submit();
};

window.createPasswordById = function () {
    $('#action-create-password').prop('disabled',true);
    var itemId = $('#item-id').val();
    var _token = $('input[name="_token"]').val();
    $.ajax({
        url: createPasswordUrl,
        method: "POST",
        data: {
            id: itemId,
            _token: _token
        },
        success: function (data) {
            $('#action-create-password').prop('disabled',false);
            $('#modal-create-password').modal('hide');
            if(data.success == true){
                toastr.success(data.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (data.success == false) {
                toastr.error(data.message, '', {timeOut: 3000});
            }
        },
        error: function (data) {
            $('#action-create-password').prop('disabled',false);
            $('#modal-create-password').modal('hide');
            if (typeof data.responseJSON.errors !== 'undefined') {
                // input error
                errorStr = '';
                $.each(data.responseJSON.errors, function (key, value) {
                    errorStr += value + '<br>';
                });
                toastr.error(errorStr, '', {timeOut: 3000});
            } else if (typeof data.responseJSON.message !== 'undefined') {
                // system error
                toastr.error(data.responseJSON.message, '', {timeOut: 3000});
            } else {
                toastr.error(data.message, '', {timeOut: 3000});
            }
            $('html,body').scrollTop(0, 0);
        }
    });
};
