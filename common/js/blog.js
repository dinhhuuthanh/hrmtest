$(function () {
    $("#is_published").bootstrapSwitch();
    $(document).on('click', '.save-blog', function(e) {
        e.preventDefault();
        $(this).prop('disabled', true);
        $('form').submit();
    });
    $(document).on('click', '.delete-blog, .publish-blog, .unpublish-blog', function() {
        $($(this).attr('data-target')).attr('data-id', $(this).data('id'));
    });
    $(document).on('click', '#action-order-blog', function() {
        sortBlog(urlSort);
    });
    $(document).on('click', '#action-delete-blog', function() {
        let blogId = $(this).parents('.modal').data('id');
        processBlog(urlDelete, blogId);
    });
    $(document).on('click', '#action-publish-blog', function() {
        let blogId = $(this).parents('.modal').data('id');
        processBlog(urlPublish, blogId);
    });
    $(document).on('click', '#action-unpublish-blog', function() {
        let blogId = $(this).parents('.modal').data('id');
        processBlog(urlUnPublish, blogId);
    });
});

//function sort blog
sortBlog = function (url) {
    let dataSort = {};
    $('#blog-table tr').each(function (index, row) {
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
}

processBlog = function (url, blogId) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        dataType: 'json',
        data: {
            id: blogId,
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
}
