$(document).ready(function() {
    var iframe = $('#inline-editor');
    $('#inline-editor-editors').hide();
    $('#inline-editor-buttons').click(function(e) {
        var assetUrl = $('#inline-editor-helper').attr('data-assetUrl');
        var writeUrl = $('#inline-editor-helper').attr('data-writeUrl');
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
            $('#inline-editor-buttons button[name="start"]').button('disable');
            $('#inline-editor-buttons button[name="cancel"]').button('enable');
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
                    el.data('spotlight', sl);
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
                    $('#inline-editor-buttons button[name="cancel"]').button('disable');
                    var sl = $(this).parent('.inline-editor-spotlight');
                    var el = sl.data('element');
                    $('#inline-editor-editors').show();
                    $('#inline-editor-editors .editor').hide();
                    $('.inline-editor-spotlight a', context).hide();
                    var data = {};
                    $.each(el.get(0).attributes, function(i, attrib) {
                        if (attrib.name.indexOf('data-inline-editor-') !== 0) return;
                        var name = attrib.name.substr(19);
                        data[name] = attrib.value;
                    });
                    // Editing is starting
                    switch (el.attr('data-inline-editor-type')) {
                        case 'string':
                            var ed = $('#inline-editor-editors .string.editor');
                            el.data('InlineEditorOriginalData', el.text());
                            ed.off();
                            ed.show();
                            ed.val(el.text());
                            ed.on('input', function(e) {
                                el.text($(this).val());
                            });
                            $('#inline-editor-editors').dialog({
                                dialogClass: 'no-close',
                                hide: true,
                                show: true,
                                resizable: false,
                                buttons: [{
                                    text: 'Opslaan',
                                    icons: { primary: 'ui-icon-circle-check' },
                                    click: function() {
                                        data.value = ed.val();
                                        $.post(writeUrl, data, null, 'json');
                                        el.data('InlineEditorOriginalData', data.value);
                                        $('#inline-editor-editors').dialog('close');
                                    }
                                },{
                                    text: 'Annuleren',
                                    icons: { secondary: 'ui-icon-circle-close' },
                                    click: function() {
                                        el.text(el.data('InlineEditorOriginalData'));
                                        $('#inline-editor-editors').dialog('close');
                                    }
                                }],
                                close: function() {
                                    $('#inline-editor-buttons button[name="cancel"]').button('enable');
                                    $('#inline-editor-editors').dialog('destroy');
                                    $('#inline-editor-editors').hide();
                                    $('.inline-editor-spotlight a', context).show();
                                }
                            });
                            break;
                        case 'text':
                            var ed = tinymce.EditorManager.get('textarea');
                            $('#check_textarea').prev('br').remove();
                            $('#check_textarea').next('label').remove();
                            $('#check_textarea').remove();
                            ed.show();
                            ed.theme.resizeTo('100%', 400);
                            el.data('InlineEditorOriginalData', el.html());
                            $('#inline-editor-editors .text.editor').show();
                            $('#inline-editor-editors').dialog({
                                dialogClass: 'no-close',
                                hide: true,
                                show: true,
                                resizable: false,
                                width: $('#textarea_tbl').width() + 25,
                                buttons: [{
                                    text: 'Opslaan',
                                    icons: { primary: 'ui-icon-circle-check' },
                                    click: function() {
                                        data.value = ed.getContent();
                                        $.post(writeUrl, data, null, 'json');
                                        el.data('InlineEditorOriginalData', data.value);
                                        $('#inline-editor-editors').dialog('close');
                                    }
                                },{
                                    text: 'Annuleren',
                                    icons: { secondary: 'ui-icon-circle-close' },
                                    click: function() {
                                        var ed = tinymce.EditorManager.get('textarea');
                                        ed.onChange.dispatch(ed, {content: el.data('InlineEditorOriginalData')});
                                        $('#inline-editor-editors').dialog('close');
                                    }
                                }],
                                close: function() {
                                    $('#inline-editor-buttons button[name="cancel"]').button('enable');
                                    $('#inline-editor-editors').dialog('destroy');
                                    $('#inline-editor-editors').hide();
                                    $('.inline-editor-spotlight a', context).show();
                                },
                                open: function() {
                                    toggleEditor('textarea');
                                    $('textarea').val(el.data('InlineEditorOriginalData'));
                                    el.html(el.data('InlineEditorOriginalData'));
                                    toggleEditor('textarea');
                                    var ed = tinymce.EditorManager.get('textarea');
                                    ed.onChange.listeners = [];
                                    ed.onChange.add(function(ed, l) {
                                        el.html(ed.getContent());
                                        // Resize our spotlight
                                        var sl = el.data('spotlight');
                                        sl.width(el.width() - 2);
                                        sl.height(el.height() -2);
                                        sl.css({
                                            'left': (el.offset().left + parseInt(el.css('padding-left') + parseInt(el.css('margin-left')))) + 'px',
                                            'top': (el.offset().top + parseInt(el.css('padding-top') + parseInt(el.css('margin-top')))) + 'px'
                                        });
                                    });
                                }
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
            $('#inline-editor-buttons button[name="start"]').button('enable');
            $('#inline-editor-buttons button[name="cancel"]').button('disable');
            $('#inline-editor-spotlight-mask', context).fadeOut();
            $('.inline-editor-spotlight', context).fadeOut();
        }
    });
    iframe.load(function() {
        $('#inline-editor-buttons button[name="start"]').button('enable');
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