$(document).ready(function () {
    const NOT_PUBLISH = 0;
    const PUBLISH = 1;
    const LIST_FILED_NAME = {
        'name': '会社名',
        'base_name': '勤務地',
        'corporate_benefits': '企業特典',
        'occupation': '職種',
        'recruitment_form': '雇用形態',
        'salary': '給与【ショート】',
        'work_area': '勤務地【選択】',
        'salary_detail': '給与【詳細】',
        'location_detail': '勤務地【詳細】',
        'description': '仕事の説明',
        'google_map': 'グーグルマップ',
        'directions_content': 'アクセス情報',
        'work_time': '勤務時間・曜日',
        'holidays': '休日・休暇',
        'allowance': '手当',
        'treatment': '待遇',
        'qualification_requirement': '応募資格',
        'contract_period': '契約期間',
        'selling_point': '入社特典(探す)',
        'logo': 'ロゴ',
        'banner': 'バナー',
    };

    $('#save').on('click', function (e) {
        $('input[name="publish"]').val(PUBLISH);
        $('#job-form').submit();
    });

    $('#temp-save').on('click', function (e) {
        $('input[name="publish"]').val(NOT_PUBLISH);
        $('#job-form').submit();
    });

    $('.preview').on('click', function (e) {
        let id = $(this).attr('data-id');
        $(`#modal-preview-${id}`).modal('show');
    });

    $(document).on('click', '.close', function() {
        $(this).parents('.modal').removeAttr('data-id');
    });

    $(document).on('change', '.input-number', function() {
        if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g,'')
    });

    $(document).on('click', '#action-add-company, #action-approve-company, #action-cancel-stop-company', function() {
        const actionId = $(this).attr('id')
        const reason = $(this).parents('.modal').find('.reason').val()
        if (actionId === 'action-cancel-stop-company') {
            if (!reason) {
                $('.require').removeAttr('hidden');
                return;
            }
        }
        let companyId = $(this).parents('.modal').attr('data-company-id');
        let status = $(this).parents('.modal').attr('data-status');
        let signed = $(this).parents('.modal').attr('data-signed');
        processAddCompany(urlAddCompany, companyId, jobId, signed, status, reason, $(this));
    });

    $(document).on('click', '#action-stop-company, #action-stop-company-comfirm-mail, #action-reject-company, #action-accept-stop-company', function() {
        const actionId = $(this).attr('id')
        const reason = $(this).parents('.modal').find('.reason').val()
        if (actionId === 'action-reject-company') {
            if (!reason) {
                $('.require').removeAttr('hidden');
                return;
            }
        }
        let companyId = $(this).parents('.modal').data('company-id');
        let status = $(this).parents('.modal').data('status');
        processCompany(urlStopCompany, companyId, jobId, status, reason);
    });

    $(document).on('click', 'input[name="is_default"]', function() {
        let companyId = $(this).data('company-id');

        if ($(this).prop('checked')) {
            let end_date = $(`.end-date-company-${companyId} input[name="end_date"]`).val();
            if (end_date) {
                $(this).prop('checked', true);
                $('input[name="is_default"]').not(this).each(function() {
                    $(this).prop('checked', false);
                });
                setDefaultCompany(urlDefaultCompany, companyId, jobId, end_date);
            } else {
                $(this).prop('checked', false);
                $('#modal-default-company .modal-title').text(config.TITLE_WARNING);
                $('#modal-default-company .modal-footer').attr('hidden', true);
                $('#modal-default-company .action-default-company').attr('hidden', true);
                $('#modal-default-company').modal('show');
                $(`.end-date-company-${companyId} .invalid-feedback`).removeAttr('hidden');
            }
        } else {
            $(this).prop('checked', false);
            removeDefaultCompany(urlRemoveDefaultCompany, companyId, jobId);
        }
    });

    $(document).on('click', '#action-default-company', function() {
        let companyId = $(this).parents('.modal').data('company-id');
        processCompany(urlStopCompany, companyId, jobId);
    });

    $(document).on('click', '#action-order-company', function() {
        sortCompany(urlSortCompany, jobId);
    });

    $(document).on('click', '.publish-job, .stop-job, .ban-job, .restart-job, .order-job, .publish-edit-job, .reject-edit-job, .not-approve-job, .approve-job', function() {
        $($(this).attr('data-target')).attr('data-id', $(this).attr('data-id'));
        $($(this).attr('data-target')).attr('data-speed', $(this).data('speed'));
        $($(this).attr('data-target')).find('.error-reason').attr('hidden', true);
        $($(this).attr('data-target')).find('.require').attr('hidden', true);
        if ($(this).attr('data-no-company')) {
            $($(this).attr('data-target')).find('.no-company').removeAttr('hidden');
            $($(this).attr('data-target')).find('.no-default-company').attr('hidden', true);
            $($(this).attr('data-target')).find('.modal-title').text(config.TITLE_WARNING);
            $($(this).attr('data-target')).find('.modal-mess').attr('hidden', true);
            $($(this).attr('data-target')).find('.modal-footer').attr('hidden', true);
            $($(this).attr('data-target')).find('.modal-company-default').text('');
        } else {
            $($(this).attr('data-target')).find('.no-company').attr('hidden', true);
            $($(this).attr('data-target')).find('.no-default-company').attr('hidden', true);
            $($(this).attr('data-target')).find('.modal-title').text(config.TITLE_CONFIRM);
            $($(this).attr('data-target')).find('.modal-mess').removeAttr('hidden');
            $($(this).attr('data-target')).find('.modal-footer').removeAttr('hidden');
            if ($(this).attr('data-company-default')) {
                $($(this).attr('data-target')).find('.modal-company-default').text(config.TITLE_COMPANY_DEFAULT + $(this).attr('data-company-default'));
            }
        }
    });

    $(document).on('click', '.add-company, .stop-company, .order-company, .approve-company, .reject-company, .accept-stop-company, .cancel-stop-company', function () {
        $($(this).attr('data-target')).find('.require').attr('hidden', true);
        $($(this).attr('data-target')).find('.modal-mess').removeAttr('hidden');
        $($(this).attr('data-target')).attr('data-company-id', $(this).data('company-id'));
        $($(this).attr('data-target')).attr('data-status', $(this).data('status'));
        $($(this).attr('data-target')).attr('data-signed', $(this).data('signed'));
        if ($(this).data('signed') == true || $(this).data('signed') === undefined) {
            $($(this).attr('data-target')).find('.modal-mess').removeAttr('hidden');
            $($(this).attr('data-target')).find('.modal-referral-url').attr('hidden', true);
            $($(this).attr('data-target')).find('.extend-modal-mess').attr('hidden', true);
            if ($(this).attr('data-target') == '#modal-add-company') {
                $('input[name="modal_referral_url"]').val('');
            }
        } else {
            $($(this).attr('data-target')).find('.modal-mess').attr('hidden', true);
            $($(this).attr('data-target')).find('.modal-referral-url').removeAttr('hidden');
            $($(this).attr('data-target')).find('.extend-modal-mess').removeAttr('hidden');
        }
    });

    $(document).on('click', '#action-publish-job, #action-publish-job-comfirm-mail', function() {
        $(this).prop('disabled', true)
        let jobId = $(this).parents('.modal').attr('data-id');
        processJob(urlPublishJob, jobId);
    });

    $(document).on('click', '#action-publish-edit-job', function() {
        $(this).prop('disabled', true)
        $('input[name="check_published"]').val(true);
        $('form').submit();
    });

    $(document).on('click', '#action-approve-job', function() {
        $(this).prop('disabled', true)
        $('input[name="check_published"]').val(true);
        $('input[name="approve"]').val(true);
        $('form').submit();
    });

    $(document).on('click', '#action-stop-job', function() {
        $(this).prop('disabled', true)
        let jobId = $(this).parents('.modal').attr('data-id');
        let data = [];
        data['speed'] = $(this).parents('.modal').data('speed');
        processJob(urlStopJob, jobId, data);
    });

    $(document).on('click', '#action-ban-job', function() {
        let jobId = $(this).parents('.modal').attr('data-id');
        let data = [];
        data['speed'] = $(this).parents('.modal').data('speed');
        processJob(urlStopJob, jobId, data);
    });

    $(document).on('click', '#action-order-job', function() {
        sort(urlSort);
    });

    $(document).on('click', '#action-restart-job', function() {
        $(this).prop('disabled', true)
        let jobId = $(this).parents('.modal').attr('data-id');
        processJob(urlRestartJob, jobId);
    });

    $(document).on('click', '#action-reject-edit-job', function() {
        if ($(this).parents('.modal').find('textarea[name="reason"]').val() == '') {
            $(this).parents('.modal').find('.error-reason').removeAttr('hidden');
        } else {
            $(this).parents('.modal').find('.error-reason').attr('hidden', true);
            $(this).prop('disabled', true)
            let jobId = $(this).parents('.modal').attr('data-id');
            let data = [];
            data['reason'] = $(this).parents('.modal').find('textarea[name="reason"]').val();
            processJob(urlRejectEditJob, jobId, data);
        }
    });

    $(document).on('click', '#action-not-approve-job', function() {
        if ($(this).parents('.modal').find('textarea[name="reason"]').val() == '') {
            $(this).parents('.modal').find('.error-reason').removeAttr('hidden');
        } else {
            $(this).parents('.modal').find('.error-reason').attr('hidden', true);
            $(this).prop('disabled', true)
            let jobId = $(this).parents('.modal').attr('data-id');
            let data = [];
            data['reason'] = $(this).parents('.modal').find('textarea[name="reason"]').val();
            processJob(urlNotApprove, jobId, data);
        }
    });

    if ($('.date').length) {
        showDatepicker($('.date'))
    }

    $(document).on('click', '#temp-save', function (e) {
        e.preventDefault();
        $(this).prop('disabled', true);
        $('form').submit();
    });

    if ($('.invalid-feedback').length && $('.invalid-feedback:first').parents('.form-group').length) {
        let error = $('.invalid-feedback:first').parents('.form-group').offset().top;
        window.scrollTo({top: error, behavior: 'smooth'});
    }

    $(document).on('click', '#job-detail-tab', function (e) {
        e.preventDefault();
        let pageUrl = window.location.href;
        window.history.pushState('', '', pageUrl.split('?')[0]);
    });

    $('#logs-data tr.has-detail').click(function () {
        let dataLogs = $(this).data('json')
        let isCreate = $(this).data('is-create')
        let imageUrl = $('#modal-logs').data('image-url')

        let arrDataChange = [];
        for(let field in dataLogs) {
            if (field !== 'data_temp' && field !== 'type' && field !== 'is_published') {
                arrDataChange.push([field, dataLogs [field]]);
            }
        }

        $('#modal-logs #detail-log').empty()
        $.each(arrDataChange, function (index, value) {
            let fieldName = value[0]
            let fieldNewData = value[1]['new'] ?? ''
            let fieldOldData = (isCreate || !value[1]['old']) ? '' : value[1]['old']
            let changeDataElm = fieldNewData
            switch (fieldName) {
                case 'banner':
                case 'logo':
                    changeDataElm = '<img style="width: 50%" src="' + imageUrl+fieldNewData + '" class="img-fluid mb-2 img-preview" alt="Logo">'
                    fieldOldData = fieldOldData ? '<img style="width: 50%" src="' + imageUrl+fieldOldData + '" class="img-fluid mb-2 img-preview" alt="Logo">' : ''
                    break
            }
            $('#modal-logs #detail-log').append(
                '<tr>' +
                    '<td>' + LIST_FILED_NAME[fieldName] + '</td>' +
                    '<td>' + fieldOldData + '</td>' +
                    '<td>' + changeDataElm + '</td>' +
                '</tr>'
            )
        })
        $('#modal-logs').modal('show')
    })

    $('#selling_point_2').on('change', function () {
        let freeDormitory = $('#free-dormitory')
        if(this.checked) {
            freeDormitory.removeClass('d-none')
        } else {
            freeDormitory.addClass('d-none')
        }
    })

    $('#seo_description').keyup(function () {
        let seoDescription = $(this).val()
        let benefit1 = $('#corporate_benefits1')
        let benefit2 = $('#corporate_benefits2')
        if (benefit1.length) {
            seoDescription = seoDescription.replace(/メーカー特典1/g, benefit1.val())
        }
        if (benefit2.length) {
            seoDescription = seoDescription.replace(/メーカー特典2/g, benefit2.val())
        }
        $('#preview-seo_description').html(seoDescription)
    })

    //if corporate_benefits1 change value => change value for preview-seo_description
    $('#corporate_benefits1').on('keyup change', function () {
        let seoDescription = $('#seo_description').val()
        seoDescription = seoDescription.replace(/メーカー特典1/g, $(this).val())
        // if corporate_benefits2.length => replace value for preview-seo_description
        if ($('#corporate_benefits2').length) {
            seoDescription = seoDescription.replace(/メーカー特典2/g, $('#corporate_benefits2').val())
        }
        $('#preview-seo_description').html(seoDescription)
    })

    //if corporate_benefits2 change value => change value for preview-seo_description
    $('#corporate_benefits2').on('keyup change', function () {
        let seoDescription = $('#seo_description').val()
        seoDescription = seoDescription.replace(/メーカー特典2/g, $(this).val())
        // if corporate_benefits1.length => replace value for preview-seo_description
        if ($('#corporate_benefits1').length) {
            seoDescription = seoDescription.replace(/メーカー特典1/g, $('#corporate_benefits1').val())
        }
        $('#preview-seo_description').html(seoDescription)
    })
});

//function sort company
sortCompany = function (url, job_id = null) {
    let dataSort = {};
    let flag = false;
    $('#result-data tr').each(function (index, row) {
        let id = $(row).attr('data-id');
        let order = $(`input[name="order-${id}"]`).val() === '' ? null : parseInt($(`input[name="order-${id}"]`).val());
        let endDate = $(`.end-date-${id} input[name="end_date"]`).val() || null;
        let referralUrl = $(`.referral-url-${id} input[name="referral_url"]`).val() || null;
        let pattern = new RegExp(/^https?:\/\/+($|[a-zA-Z0-9_~=:&\?\.\/-])+$/);
        if (referralUrl !== null) {
            if(pattern.test(referralUrl) === false) {
                $(`.referral-url-${id} .invalid-feedback`).removeAttr('hidden');
                flag = true;
            } else {
                $(`.referral-url-${id} .invalid-feedback`).attr('hidden', true);
            }
        } else if ($(`.referral-url-${id} input[name="referral_url"]`).not('input[type="hidden"]').val() == '') {
            $(`.referral-url-${id} .invalid-feedback`).removeAttr('hidden');
            flag = true;
        }

        if (id) {
            dataSort[id] = {'order':order, 'end_date':endDate, 'referral_url':referralUrl};
        }
    });
    if (flag === true) {
        $('#modal-order-company').modal('hide');
        $('html, body').stop().animate({
            scrollTop: $('.invalid-feedback:first').parents('.input-group').offset().top
        }, 500);
        return;
    }
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        dataType: 'json',
        data: {
            data_sort: dataSort,
            job_id: job_id,
        },
        success: function (response) {
            if (response.success) {
                toastr.success(response.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    });
};

//function sort job
sort = function (url) {
    let dataSort = {};
    $('#result-data tr').each(function (index, row) {
        let id = $(row).attr('data-id');
        let order = $(`input[name="order-${id}"]`).val() === '' ? null : parseInt($(`input[name="order-${id}"]`).val());
        let oldOrder = $(`input[name="order-${id}"]`).data('old-value');
        if (order !== oldOrder) {
            dataSort[id] = order;
        }
    });

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        dataType: 'json',
        data: {
            data_sort: dataSort,
        },
        success: function (response) {
            if (response.success) {
                toastr.success(response.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    });
};

processCompany = function(url, companyId, jobId, status=null, reason = null, element = null) {
    if (element) {
        element.prop('disabled', true);
    }
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        data: {
            company_id: companyId,
            job_id: jobId,
            status: status,
            reason: reason
        },
        success: function (response) {
            if (response.success) {
                toastr.success(response.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    });
};

processAddCompany = function(url, companyId, jobId, signed, status=null, reason = null, element = null) {
    $('.require').attr('hidden', true);
    $('.regex').attr('hidden', true);
    let referralUrl = $('input[name="modal_referral_url"]').val();
    let pattern = new RegExp(/^https?:\/\/+($|[a-zA-Z0-9_~=:&\?\.\/-])+$/);
    if (signed == 0) {
        if(referralUrl === '') {
            $('.require').removeAttr('hidden');
            return;
        } else {
            $('.require').attr('hidden', true);
        }
        if(pattern.test(referralUrl) === false) {
            $('.regex').removeAttr('hidden');
            return;
        } else {
            $('.regex').attr('hidden', true);
        }
    }
    if (element) {
        element.prop('disabled', true);
    }
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        data: {
            company_id: companyId,
            job_id: jobId,
            status: status,
            referral_url: referralUrl,
            reason: reason
        },
        success: function (response) {
            if (response.success) {
                toastr.success(response.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    });
};

processJob = function (url, jobId, data=[]) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        dataType: 'json',
        data: {
            job_id: jobId,
            speed: data['speed'] ?? null,
            reason: data['reason'] ?? null,
        },
        success: function (response) {
            if (response.success) {
                toastr.success(response.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    });
};

setDefaultCompany = function(url, companyId, jobId, endDate) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        data: {
            company_id: companyId,
            job_id: jobId,
            end_date: endDate
        },
        success: function (response) {
            if (response.success) {
                toastr.success(response.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    });
};

removeDefaultCompany = function(url, companyId, jobId) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        data: {
            company_id: companyId,
            job_id: jobId,
        },
        success: function (response) {
            if (response.success) {
                toastr.success(response.message, '', {timeOut: 2000});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toastr.error(response.message, '', {timeOut: 3000});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    });
};
