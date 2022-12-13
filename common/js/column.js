$(document).ready(function () {
    $(document).on('click', '.add-column, .stop-column, .delete-column', function () {
        $($(this).attr('data-target')).attr('data-column-id', $(this).data('column-id'));
    });

    $(document).on('click', '#action-stop-column', function() {
        let columnId = $(this).parents('.modal').attr('data-column-id');
        processColumn(urlUnpublishColumn, columnId);
    });

    $(document).on('click', '#action-add-column', function() {
        let columnId = $(this).parents('.modal').attr('data-column-id');
        processColumn(urlPublishColumn, columnId);
    });

    $(document).on('click', '#action-delete-column', function() {
        let columnId = $(this).parents('.modal').attr('data-column-id');
        processColumn(urlDeleteColumn, columnId);
    });

    $(document).on('click', '#action-order-column', function() {
        sort(urlSort);
    });
})

function processColumn(url, columnId) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: url,
        method: 'POST',
        dataType: 'json',
        data: {
            column_id: columnId,
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

//function sort job
function sort(url) {
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
}
