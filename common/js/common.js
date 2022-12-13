$(function () {
    // Summernote
    $('.textarea').summernote({
        callbacks: {
            onImageUpload: function (data) {
                data.pop();
            },
            /* KetNH: remove on 2022-09-19
            onPaste: function (e) {
                var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                let bufferTextArr = bufferText.split("\r\n");
                let newArr = [];
                bufferTextArr.forEach(function (item, index) {
                    item = item.charAt(0).replace(/([^ぁ-んァ-ヶー一-龠a-zA-Z0-9●■%、※()（）【】！＋×〜／＝-])$/g, '') + item.slice(1);
                    newArr.push(item);
                });
                bufferText = newArr.join("\r\n");
                e.preventDefault();
                setTimeout(function(){
                    document.execCommand( 'insertText', false, bufferText );
                }, 10);
            },
            */
        },
        height: 200,   //set editable area's height
        codemirror: { // codemirror options
            theme: 'monokai'
        },
        disableDragAndDrop:true,
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['link']], 
        ],
        cleaner:{
            notTime: 2400, // Time to display Notifications.
            action: 'both', // both|button|paste 'button' only cleans via toolbar button, 'paste' only clean when pasting content, both does both options.
            newline: '<br>', // Summernote's default is to use '<p><br></p>'
            notStyle: 'position:absolute;top:0;left:0;right:0', // Position of Notification
            icon: '<i class="note-icon">[Your Button]</i>',
            keepHtml: true, // Remove all Html formats
            keepOnlyTags: ['<p>', '<br>', '<ul>', '<li>', '<b>', '<strong>','<i>', '<a>'], // If keepHtml is true, remove all tags except these
            keepClasses: false, // Remove Classes
            badTags: ['style', 'script', 'applet', 'embed', 'noframes', 'noscript', 'html'], // Remove full tags with contents
            badAttributes: ['style', 'start'] // Remove attributes from remaining tags
        },
        lang: 'ja-JP'
    });

    // Input file
    bsCustomFileInput.init();

    $('.btn-tooltip').tooltip();

    $('input[type="file"]').change(function () {
        if ($(this).val()) {
            if (typeof isReferralCompany !== 'undefined') {
                validateFile(this, $(this), true);
            } else {
                validateFile(this, $(this), false);
            }
        } else {
            let imgPreview = $(this).parents('.container-image').find('.img-preview');
            if (imgPreview.data('old-src')) {
                imgPreview.attr('src', imgPreview.data('old-src'));
            } else {
                imgPreview.attr('hidden', true);
            }
        }
    });

    $(document).on('change', '.input-order', function() {
        let max = parseInt($(this).attr('max'));
        let min = parseInt($(this).attr('min'));
        if ($(this).val() > max) {
            $(this).val(max);
        } else if ($(this).val() < min) {
            $(this).val(min);
        }
    });

    $(document).on('click', '.notification-item', function() {
        if ($(this).hasClass('unseen')) {
            let id = $(this).data('id');
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: urlUpdateNotification,
                method: 'POST',
                data: {
                    id: id
                },
                success: function (response) {
                    if (response) {
                        window.location.href = '/recruitment-jobs/edit/' + response + '?tab=logs';
                    } else {
                        toastr.error('ページをリロードして、再度試してください。', '', {timeOut: 3000});
                    }
                },
                error: function (response) {
                    return false;
                }
            });
        } else {
            window.location.href = '/recruitment-jobs/edit/' + $(this).data('job-id') +  '?tab=logs';
        }
    });

    if ($('.dropdown-notification').height() > 300) {
        $('.dropdown-notification').css('height', '300px');
    }

    $(document).on('click', '.see-more-notify', function(e) {
        e.stopPropagation();
        let countNotification = $('.notification-item').length;
        let element = $(this);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url: urlListNotification,
            method: 'GET',
            data: {
                offset: countNotification
            },
            success: function (response) {
                if (response.html) {
                    $('.notification-item').remove();
                    $('.dropdown-divider').remove();
                    element.before(response.html);
                    if ($('.dropdown-notification').height() > 300) {
                        $('.dropdown-notification').css('height', '300px');
                    }
                    if (!response.checkSeeMore) {
                        element.remove();
                    }
                }
            },
            error: function (response) {
                return false;
            }
        });
    });
});

// validate file
window.validateFile = function(file, element, isReferralCompany = false) {
    let fileChoose = file.files[0];
    let sizeInMb = fileChoose.size/1024;
    let sizeLimit= 1024;
    let validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];
    let spanError = element.parents('div.form-group').find('span.invalid-feedback');
    let imgPreview = element.parents('.container-image').find('.img-preview');
    if (isReferralCompany) {
        divParentFile = element.parents('div.input-group');
    } else {
        divParentFile = element.parents('div.custom-file');
    }

    if (!validImageTypes.includes(fileChoose.type)) {
        if (spanError.length !== 0) {
            spanError.text(config.INVALID_IMAGES_FORMAT);
        } else {
            divParentFile.append('<span class="error invalid-feedback">' + config.INVALID_IMAGES_FORMAT + '</span>');
        }

        element.val('');
        element.parents('div.form-group').find('.custom-file-label').text('ファイルを選択してください');
        if (imgPreview.data('old-src')) {
            imgPreview.attr('src', imgPreview.data('old-src'));
        } else {
            imgPreview.attr('hidden', true);
        }
    } else if (sizeInMb > sizeLimit) {
        if (spanError.length !== 0) {
            spanError.text(config.MAX_SIZE_OF_FILE);
        } else {
            divParentFile.append('<span class="error invalid-feedback">' + config.MAX_SIZE_OF_FILE + '</span>');
        }

        element.val('');
        element.parents('div.form-group').find('.custom-file-label').text('ファイルを選択してください');
        if (imgPreview.data('old-src')) {
            imgPreview.attr('src', imgPreview.data('old-src'));
        } else {
            imgPreview.attr('hidden', true);
        }
    } else {
        spanError.remove();
        let reader = new FileReader();
        reader.onload = function() {
            imgPreview.removeAttr('hidden');
            imgPreview.attr('src', reader.result);
        };
        reader.readAsDataURL(fileChoose);
    }
};

// date range picker
window.showDatepicker = function(element, minYear=null, maxYear=null) {
    minYear = minYear ?? 1901;
    maxYear = maxYear ?? moment().year() + 1;
    element.daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minDate: moment().year(minYear).startOf('year').format('YYYY-MM-DD'),
        maxDate: moment().year(maxYear).endOf('year').format('YYYY-MM-DD'),
        autoApply: true,
        autoUpdateInput: false,
        locale: {
            format: 'YYYY-MM-DD',
            "daysOfWeek": ["日", "月", "火", "水", "木", "金", "土"],
            "monthNames": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        }
    });
    element.on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
    });
    element.on('change', function () {
        if ($(this).val()) {
            let result = moment($(this).val(), 'YYYY-MM-DD', true).isValid();
            if (!result) {
                $(this).val(moment(new Date()).format('YYYY-MM-DD'));
            }
        }
    });
};
