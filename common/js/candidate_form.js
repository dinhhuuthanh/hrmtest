$(document).ready(function () {
    //Date picker
    showDatepicker($(".input-birthday-date"), moment().year()- config.SUB_START_BIRTHDAY, moment().year() - config.SUB_END_BIRTHDAY)
    showDatepicker($(".input-date"))

    //Initialize Select2 Elements
    $('.select2').select2();

    if (joinStatus == 1) {
        if (recruitJobId !== undefined && recruitJobId != "") {
            getBaseName();
        }
        if (referCompanyId !== undefined && referCompanyId != "") {
            getCompany();
        }
    }

    $(document).on('click', '#action-send-mail-company', function (e) {
        e.preventDefault();
        $(this).prop('disabled', true);
        $('form').find('input[name="is_send"]').val(true);
        $('form').submit();
    });

    $(document).on('click', '#action-no-send-mail-company', function (e) {
        e.preventDefault();
        $(this).prop('disabled', true);
        $('form').find('input[name="is_send"]').val('');
        $('form').submit();
    });
});

$('#job-id').on('change', function (e) {
    var id = $(this).val();
    if (id == undefined || id == '') {
        $('#basename').html('<option value="">勤務地を選択してください</option>');
        $('#basename').prop("disabled", true);
        return false;
    }
    getBaseName(id);
    getCompany(id);
});

$('#basename').on('change', function (e) {
    const PICKUP_TYPE = 2;
    var type = $(this).children('option:selected').data('type');
    var job_id = $(this).val();
    if (job_id == undefined || job_id == '' || type == PICKUP_TYPE) {
        $('#referral-company').html('<option value="">紹介会社を選択してください</option>');
        $('#referral-company').prop("disabled", true);
        $('input[name="type"]').val(PICKUP_TYPE);
        $('#btn-create').removeAttr("type").attr("type", "submit");
        $('#btn-create').attr('data-toggle', '');
        $('#btn-create').attr('data-target', '');
        return false;
    } else {
        $('#btn-create').removeAttr("type").attr("type", "button");
        $('#btn-create').attr('data-toggle', 'modal');
        $('#btn-create').attr('data-target', '#modal-send-mail-company');
    }
    $('input[name="type"]').val(type);
    getCompany(job_id);
});

window.getBaseName = function (idInput) {
    var _token = $('input[name="_token"]').val();
    $('#basename').html('<option value="">勤務地を選択してください</option>');
    $('#referral-company').html('<option value="">紹介会社を選択してください</option>');
    var job_id = idInput !== undefined ? idInput : $('#job-id').val();
    $.ajax({
        url: getJobUrl,
        method: "POST",
        data: {
            job_id: job_id,
            _token: _token,
            type: config.DATA_TYPE_OF_JOB.BASENAME
        },
        success: function (data) {
            $('#basename').prop("disabled", false);
            $.each(data.result, function(index, value) {
                let base_name = value.base_name || '';
                $('#basename').append('<option value="' + value.id + '" data-type="' + value.type + '" selected>' + base_name + '</option>');
            });
            $('input[name="type"]').val(data.result[0].type || 2);
        },
        error: function (data) {
            return false;
        }
    });
};

window.getCompany = function (jobIdInput) {
    var _token = $('input[name="_token"]').val();
    $('#referral-company').html('<option value="">紹介会社を選択してください</option>');
    var job_id = jobIdInput !== undefined ? jobIdInput : recruitJobId;
    $.ajax({
        url: getJobUrl,
        method: "POST",
        data: {
            job_id: job_id,
            _token: _token,
            type: config.DATA_TYPE_OF_JOB.REFERRAL_COMPANY
        },
        success: function (data) {
            $('#referral-company').prop("disabled", false);
            $.each(data.result, function(index, value) {
                if (value.referral_company_id == referCompanyId) {
                    $('#referral-company').append('<option value="' + value.referral_company_id + '" selected>' + value.referral_company.name + '</option>');
                } else {
                    if (value.referral_company) {
                        $('#referral-company').append($('<option>', {
                            value: value.referral_company_id,
                            text: value.referral_company.name
                        }));
                    }
                }

            });
        },
        error: function (data) {
            return false;
        }
    });
};
