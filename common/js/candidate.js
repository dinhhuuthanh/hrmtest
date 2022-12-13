const SUCCESS = 200;
const ERROR = 404;
const ENTER_KEYCODE = 13

$(document).ready(function () {
    $('.update-join-status').on('click', function (e) {
        e.preventDefault();
        let id = $(this).attr('data-id');
        if ($('.btn-change-status-'+id).length) {
            $('.btn-change-status-'+id).css("pointer-events", "");
        }
        $("#modal-update-join-status-" + id).modal('show');
    });

    $('.receive-money-status').on('click', function (e) {
        e.preventDefault();
        let id = $(this).attr('data-id');
        if (!$(this).hasClass('disabled')) {
            if ($('.receive-money-'+id).length) {
                $('.receive-money-'+id).css("pointer-events", "");
            }
            $("#modal-update-receive-money-status-" + id).modal('show');
        }
    });

    /**
     * Show date picker
     */
    showDatepicker($(".join_date"));
    showDatepicker($("#apply_start_date"));
    showDatepicker($("#apply_end_date"));
    showDatepicker($("#join_start_date"));
    showDatepicker($("#join_end_date"));

    $('select[name="join_status"]').change(function () {
        let candidate_id = $(this).attr('data-id');
        if ($(this).val() == STATUS_JOINED || $(this).val() == STATUS_PLAN_TO_JOIN) {
            $("#join_date_container_" + candidate_id).css('display', 'block')
        } else {
            $("#join_date_container_" + candidate_id).css('display', 'none')
        }
    });

    $(".join_date, #apply_start_date, #apply_end_date, #join_start_date, #join_end_date").on('keyup keypress', function(e) {
        let keyCode = e.keyCode || e.which;
        if (keyCode === ENTER_KEYCODE) {
            e.preventDefault();
            return false;
        }
    });
});

$(document).on('click', '#btn-change-status', function () {
    $(this).attr("disabled", true);
    let candidate_id = $(this).attr('data-id');
    let form_name = "update_join_status_form_"+candidate_id;
    let form = $("form[name="+form_name+"]");
    let button = '.btn-change-status-'+candidate_id;
    $(button).css("pointer-events", "none");
    if ($("#input_join_status_"+candidate_id).length && $("#input_join_status_"+candidate_id).val() == STATUS_JOINED) {
        $("#modal-update-join-status-" + candidate_id).modal('hide');
        $(button).css("pointer-events", "");
        $("#modal-comfirm-send-mail-company-candidate form").attr('action', form.attr('action'));
        $("#modal-comfirm-send-mail-company-candidate form input.data").attr('value', form.serialize());
        $("#modal-comfirm-send-mail-company-candidate form input.candidate_id").attr('value', candidate_id);
        $("#modal-comfirm-send-mail-company-candidate form input.action").attr('value', 'change-join-status');
        $('#action-comfirm-send-mail-company-candidate').css("pointer-events", "");
        $("#modal-comfirm-send-mail-company-candidate").modal('show');
        return false;
    }
    submit_join_status_status(form.attr('action'), form.serialize(), candidate_id, button);
});

function submit_join_status_status(url, data, candidate_id, button, this_modal) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function (response) {
            $('.invalid-join-status').css('display', 'none');
            if (response.status === SUCCESS) {
                if (response.errors) {
                    if ($("#modal-update-join-status-" + candidate_id).is(":hidden")) {
                        $(this_modal).modal('hide');
                        $("#modal-update-join-status-" + candidate_id).modal('show');
                    }
                    for (const [key, msg] of Object.entries(response.errors)) {
                        $('#error_' + key + '_' + candidate_id).html(msg).css('display', 'block');
                    }
                    $(button).css("pointer-events", "");
                } else {
                    toastr.success(response.message, '', {timeOut: 2000});
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            } else if (response.status === ERROR) {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                $(button).css("pointer-events", "");
            }
        }
    })
}

$(document).on('click', '#btn-change-receive-money-status', function () {
    let candidate_id = $(this).attr('data-id');
    let form_name = "update_receive_money_status_form_"+candidate_id;
    let form = $("form[name="+form_name+"]");
    let button = '.receive-money-'+candidate_id;
    $(button).css("pointer-events", "none");
    let receive_money_status = $("#input_receive_money_status_" + candidate_id).val()

    /* 2022/06/07: System has comment send mail status equal RECEIVE_MONEY_CONFIRM.
    // Send mail to admin and candidate
    if (receive_money_status == RECEIVE_MONEY_CONFIRM) {
        $("#modal-update-receive-money-status-" + candidate_id).modal('hide');
        $(button).css("pointer-events", "");
        $("#modal-comfirm-send-mail-admin-candidate form").attr('action', form.attr('action'));
        $("#modal-comfirm-send-mail-admin-candidate form input.data").attr('value', form.serialize());
        $("#modal-comfirm-send-mail-admin-candidate form input.candidate_id").attr('value', candidate_id);
        $("#modal-comfirm-send-mail-admin-candidate form input.action").attr('value', 'change-receive-money-status');
        $('#action-comfirm-send-mail-admin-candidate').css("pointer-events", "none");
        $("#modal-comfirm-send-mail-admin-candidate").modal('show');
        return false;
    } */

    // Send mail to company and candidate
    if (receive_money_status == RECEIVE_MONEY_TRANSFER_COMPLETE) {
        $("#modal-update-receive-money-status-" + candidate_id).modal('hide');
        $(button).css("pointer-events", "");
        $("#modal-comfirm-send-mail-company-candidate form").attr('action', form.attr('action'));
        $("#modal-comfirm-send-mail-company-candidate form input.data").attr('value', form.serialize());
        $("#modal-comfirm-send-mail-company-candidate form input.candidate_id").attr('value', candidate_id);
        $("#modal-comfirm-send-mail-company-candidate form input.action").attr('value', 'change-receive-money-status');
        $('#action-comfirm-send-mail-company-candidate').css("pointer-events", "");
        $("#modal-comfirm-send-mail-company-candidate").modal('show');
        return false;
    }
    submit_receive_money_status(form.attr('action'), form.serialize(), candidate_id, button);
});

$(document).on('click', '#action-comfirm-send-mail-company-candidate', function () {
    let url = $("#modal-comfirm-send-mail-company-candidate form").attr('action');
    let data = $("#modal-comfirm-send-mail-company-candidate form input.data").attr('value');
    let candidate_id = $("#modal-comfirm-send-mail-company-candidate form input.candidate_id").attr('value');
    let action = $("#modal-comfirm-send-mail-company-candidate form input.action").attr('value');
    let this_modal = "#modal-comfirm-send-mail-company-candidate";
    let button = '#action-comfirm-send-mail-company-candidate';
    $(button).css("pointer-events", "none");

    if (action == 'change-join-status') {
        submit_join_status_status(url, data, candidate_id, button, this_modal);
    } else if (action == 'change-receive-money-status') {
        submit_receive_money_status(url, data, candidate_id, button, this_modal);
    }
});

$(document).on('click', '#action-comfirm-send-mail-admin-candidate', function () {
    url = $("#modal-comfirm-send-mail-admin-candidate form").attr('action');
    data = $("#modal-comfirm-send-mail-admin-candidate form input.data").attr('value');
    candidate_id = $("#modal-comfirm-send-mail-admin-candidate form input.candidate_id").attr('value');
    let this_modal = "#modal-comfirm-send-mail-admin-candidate";
    let button = '#action-comfirm-send-mail-admin-candidate';
    $(button).css("pointer-events", "none");
    submit_receive_money_status(url, data, candidate_id, button, this_modal);
});

function submit_receive_money_status(url, data, candidate_id, button, this_modal) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function (response) {
            if (response.status === SUCCESS) {
                if (response.errors) {
                    if ($("#modal-update-receive-money-status-" + candidate_id).is(":hidden")) {
                        $(this_modal).modal('hide');
                        $("#modal-update-receive-money-status-" + candidate_id).modal('show');
                    }
                    for (const [key, msg] of Object.entries(response.errors)) {
                        $('#error_' + key + '_' + candidate_id).html(msg).css('display', 'block')
                    }
                    $(button).css("pointer-events", "");
                } else {
                    $('.invalid-receive-money').css('display', 'none');
                    if (response.status === SUCCESS) {
                        toastr.success(response.message, '', {timeOut: 2000});
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                }
            } else {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    })
}

$('#csv_btn').on('click', function() {
    $('#form_csv').submit()
})
