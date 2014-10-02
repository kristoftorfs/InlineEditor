$(document).ready(function() {
    var iframe = $('#inline-editor');
    $('#inline-editor-editors').hide();
    $('#inline-editor-buttons').click(function(e) {
        var assetUrl = $('#inline-editor-helper').attr('data-assetUrl');
        var siteId = $('#inline-editor-helper').attr('data-site');
        var context = $(iframe).contents();
        var el = $(e.target).parent('button');
        if (!el.attr('name')) return;
        var ready = $('body', context).hasClass('inline-editor-ready');
        el.blur();
        if (el.attr('name') == 'start') {
            // Check if we are on an active page for this site
            if ($('*[data-inline-editor-site="' + siteId + '"]', context).length == 0) {
                // TODO: error message
                return;
            }
            // Create mask and all spotlights if this has not happened before
            if (!ready) {
                // Append our stylesheet to the iframe
                $('head', context).append('<link rel="stylesheet" type="text/css" href="' + assetUrl + '/stylesheet.css">');
                // Append our mask to the iframe body
                $('body', context).prepend('<div id="inline-editor-spotlight-mask"></div>');
                // Create the spotlight for each item
                $('*[data-inline-editor-site="' + siteId + '"]', context).each(function(index, el) {
                    el = $(el);
                    var sl = $('<div class="inline-editor-spotlight"><a href=""></a></div>');
                    sl.data('element', el);
                    $('a', sl).text('Bewerken');
                    $('body', context).prepend(sl);
                    // Calculate dimensions and position of our spotlight and show it
                    sl.width(el.width() - 2);
                    sl.height(el.height() -2);
                    sl.css({
                        'left': (el.offset().left + parseInt(el.css('padding-left') + parseInt(el.css('margin-left')))) + 'px',
                        'top': (el.offset().top + parseInt(el.css('padding-top') + parseInt(el.css('margin-top')))) + 'px'
                    });
                });
                // Create our click event (editor) for every spotlight
                $('.inline-editor-spotlight a', context).click(function(e) {
                    e.preventDefault();
                    var sl = $(this).parent('.inline-editor-spotlight');
                    var el = sl.data('element');
                    $('#inline-editor-editors').show();
                    $('#inline-editor-editors .editor').hide();
                    $('#inline-editor-editors .buttons button[name="cancel"]').off('click').click(function(e) {
                        $('#inline-editor-editors').hide();
                        // Editing is cancelled
                        switch (el.attr('data-inline-editor-type')) {
                            case 'string':
                                el.text(el.data('InlineEditorOriginalData'));
                                break;
                        }
                    });
                    // Editing is starting
                    switch (el.attr('data-inline-editor-type')) {
                        case 'string':
                            var ed = $('#inline-editor-editors input[type="text"]');
                            el.data('InlineEditorOriginalData', el.text());
                            ed.off();
                            ed.show();
                            ed.val(el.text());
                            ed.on('input', function(e) {
                                el.text($(this).val());
                            });
                            break;
                    }
                });
                var mask = $('#inline-editor-spotlight-mask', context);
                // Show the mask
                mask.width(context.width());
                mask.height(context.height());
                mask.fadeIn();
                $('body', context).addClass('inline-editor-ready');
            } else {
                $('#inline-editor-spotlight-mask', context).fadeIn();
                $('.inline-editor-spotlight', context).fadeIn();
            }
        } else if (el.attr('name') == 'cancel') {
            $('#inline-editor-spotlight-mask', context).fadeOut();
            $('.inline-editor-spotlight', context).fadeOut();
        }
    });
    iframe.load(function() {
        $('#inline-editor-buttons button').button('option', 'disabled', false);
    });
    /*
    iframe.contents().on('unload', function() {
        alert('oi');
    });
    console.log(document.getElementById('inline-editor').onunload);
     */
    return;
    $(iframe).load(function() {
        var mask = $('#inline-editor-spotlight-mask', context);
        $('*[data-inline-editor-name]', context).mouseenter(function(e) {
            var el = $(e.delegateTarget);
            var ed = el.data('spotlight');
            // Calculate dimensions of our mask and show it
            mask.width(context.width());
            mask.height(context.height());
            //mask.css('display', 'block');
            mask.fadeIn();
            // Calculate dimensions and position of our spotlight and show it
            ed.width(el.width());
            ed.height(el.height());
            ed.css({
                'display': 'block',
                'left': (el.offset().left + parseInt(el.css('padding-left') + parseInt(el.css('margin-left')))) + 'px',
                'top': (el.offset().top + parseInt(el.css('padding-top') + parseInt(el.css('margin-top')))) + 'px'
            });
        });
        var leave = function(e) {
            var el = $(e.delegateTarget);
            if (!el.hasClass('inline-editor-spotlight')) el = el.next('.inline-editor-spotlight');
            el.css('display', 'none');
            //mask.css('display', 'none');
            mask.hide();
        };
        $('.inline-editor-spotlight', context).mouseout(leave);
        //$('*[data-inline-editor-name]', context).mouseleave(leave);
    });
});