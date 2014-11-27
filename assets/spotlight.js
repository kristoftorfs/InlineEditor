$(document).ready(function() {
    var iframe = $('#inline-editor');
    var assetUrl = $('#inline-editor-helper').attr('data-assetUrl');
    var writeUrl = $('#inline-editor-helper').attr('data-writeUrl');
    var siteId = $('#inline-editor-helper').attr('data-site');
    var actionId = $('#inline-editor-helper').attr('data-actionId');
    window.InlineEditor = {
        // Iframe context
        context: null,
        // Calculate dimensions and position of our spotlights
        spotlights: function() {
            $('*[data-inline-editor-site="' + siteId + '"]', window.InlineEditor.context).each(function(index, el) {
                el2 = $(el);
                var sl = el2.data('spotlight');
                sl.width(el2.width() - 2);
                sl.height(el2.height() -2);
                sl.css({
                    'left': (el2.offset().left + parseInt(el2.css('padding-left') + parseInt(el2.css('margin-left')))) + 'px',
                    'top': (el2.offset().top + parseInt(el2.css('padding-top') + parseInt(el2.css('margin-top')))) + 'px'
                });
            });
        }
    };
    $('#inline-editor-editors').hide();
    $('#inline-editor-buttons').click(function(e) {
        var context = window.InlineEditor.context = iframe.contents();
        if (e.target.tagName == 'BUTTON') var el = $(e.target);
        else var el = $(e.target).parent('button');
        if (!el.attr('name')) return;
        var ready = $('body', context).hasClass('inline-editor-ready');
        el.blur();
        if (el.attr('name') == 'start') {
            // Check if we are on an active page for this site
            if ($('*[data-inline-editor-site="' + siteId + '"]', context).length == 0) {
                alert($('#inline-editor-helper').attr('data-lang-error'));
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
                    var sl = $('<div class="inline-editor-spotlight">' + $('#inline-editor-helper a.spotlight-editor').outerHTML() + '</div>');
                    sl.data('element', el);
                    el.data('spotlight', sl);
                    $('body', context).prepend(sl);
                });
                window.InlineEditor.spotlights();
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
                    var els = $(
                        '*[data-inline-editor-name="' + el.attr('data-inline-editor-name') + '"]'
                        + '[data-inline-editor-type="' + el.attr('data-inline-editor-type') + '"]'
                        + '[data-inline-editor-page="' + el.attr('data-inline-editor-page') + '"]'
                        + '[data-inline-editor-site="' + el.attr('data-inline-editor-site') + '"]'
                        , context);
                    switch (el.attr('data-inline-editor-type')) {
                        case 'redirect':
                            var url = el.attr('data-inline-editor-redirect').replace(/__actionId__/g, actionId);
                            var cnf = confirm($('#inline-editor-helper').attr('data-lang-redirect'));
                            if (cnf) {
                                window.location.href = url;
                            } else {
                                $('#inline-editor-editors').hide();
                                $('.inline-editor-spotlight a', context).show();
                            }
                            break;
                        case 'string':
                            var ed = $('#inline-editor-editors .string.editor');
                            el.data('InlineEditorOriginalData', el.text());
                            ed.off();
                            ed.show();
                            ed.val($.trim(el.text()));
                            ed.on('input', function(e) {
                                els.text($(this).val());
                                window.InlineEditor.spotlights();
                            });
                            $('#inline-editor-editors').dialog({
                                dialogClass: 'no-close',
                                hide: true,
                                show: true,
                                resizable: false,
                                width: 'auto',
                                buttons: [{
                                    text: $('#inline-editor-helper').attr('data-lang-save'),
                                    icons: { primary: 'ui-icon-circle-check' },
                                    click: function() {
                                        data.value = ed.val();
                                        $.post(writeUrl, data, null, 'json');
                                        els.data('InlineEditorOriginalData', data.value);
                                        $('#inline-editor-editors').dialog('close');
                                    }
                                },{
                                    text: $('#inline-editor-helper').attr('data-lang-cancel'),
                                    icons: { secondary: 'ui-icon-circle-close' },
                                    click: function() {
                                        els.text(el.data('InlineEditorOriginalData'));
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
                        case 'link':
                            var ed = $('#inline-editor-editors .link.editor');
                            el.data('InlineEditorOriginalData', { href: el.attr('data-inline-editor-link-value'), text: el.text() });
                            ed.show();
                            ed.find('input[name="linktext"]').val($.trim(el.text()));
                            ed.find('input[name="linktext"]').off().on('input', function(e) {
                                els.text($(this).val());
                                window.InlineEditor.spotlights();
                            });
                            ed.find('select[name="linkhref"]').val(el.attr('data-inline-editor-link-value'));
                            $('#inline-editor-editors').dialog({
                                dialogClass: 'no-close',
                                hide: true,
                                show: true,
                                resizable: false,
                                width: 'auto',
                                buttons: [{
                                    text: $('#inline-editor-helper').attr('data-lang-save'),
                                    icons: { primary: 'ui-icon-circle-check' },
                                    click: function() {
                                        data.value = {
                                            href: ed.find('select[name="linkhref"]').val(),
                                            text: ed.find('input[name="linktext"]').val()
                                        };
                                        data.reload = context.get(0).location.toString();
                                        $.post(writeUrl, data, null, 'json');
                                        els.data('InlineEditorOriginalData', data.value);
                                        $('#inline-editor-editors').dialog('close');
                                        document.location.reload();
                                    }
                                },{
                                    text: $('#inline-editor-helper').attr('data-lang-cancel'),
                                    icons: { secondary: 'ui-icon-circle-close' },
                                    click: function() {
                                        els.text(el.data('InlineEditorOriginalData').text);
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
                            el.data('InlineEditorOriginalData', $.trim(el.html()));
                            $('#inline-editor-editors .text.editor').show();
                            $('#inline-editor-editors').dialog({
                                dialogClass: 'no-close',
                                hide: true,
                                show: true,
                                resizable: false,
                                width: 'auto',
                                buttons: [{
                                    text: $('#inline-editor-helper').attr('data-lang-save'),
                                    icons: { primary: 'ui-icon-circle-check' },
                                    click: function() {
                                        data.value = ed.getContent();
                                        $.post(writeUrl, data, null, 'json');
                                        els.data('InlineEditorOriginalData', data.value);
                                        $('#inline-editor-editors').dialog('close');
                                    }
                                },{
                                    text: $('#inline-editor-helper').attr('data-lang-cancel'),
                                    icons: { secondary: 'ui-icon-circle-close' },
                                    click: function() {
                                        //var ed = tinymce.EditorManager.get('textarea');
                                        //ed.onChange.dispatch(ed, {content: el.data('InlineEditorOriginalData')});
                                        els.html(el.data('InlineEditorOriginalData'));
                                        $('#inline-editor-editors').dialog('close');
                                        // Resize our spotlight(s)
                                        window.InlineEditor.spotlights();
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
                                    els.html(el.data('InlineEditorOriginalData'));
                                    toggleEditor('textarea');
                                    var ed = tinymce.EditorManager.get('textarea');
                                    ed.onChange.listeners = [];
                                    ed.onChange.add(function(ed, l) {
                                        els.html(ed.getContent());
                                        // Resize our spotlight(s)
                                        window.InlineEditor.spotlights();
                                    });
                                }
                            });
                            break;
                        case 'thumbnail':
                            var form = $('form[data-form="editthumbnail"]');
                            el.get(0).setAttribute('data-inline-editor-iframeUrl', context.get(0).location.toString());
                            $.each(el.get(0).attributes, function(i, attrib) {
                                if (attrib.name.indexOf('data-inline-editor-') !== 0) return;
                                var name = attrib.name.substr(19);
                                var el = $('<input type="hidden">');
                                el.attr('name', actionId + name);
                                el.val(attrib.value);
                                form.append(el);
                            });
                            form.submit();
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
        var autoEdit = $('#inline-editor-helper').attr('data-autoEdit');
        if (!autoEdit) return;
        setTimeout(function() {
            var context = iframe.contents();
            $('#inline-editor-buttons button[name="start"]').click();
            var el = context.find('*[data-inline-editor-name="' + autoEdit + '"]').first();
            context.find('html, body').animate({
                scrollTop: el.offset().top,
                scrollLeft: el.offset().left
            })
        }, 100);
    });
    /*
    iframe.contents().on('unload', function() {
        alert('oi');
    });
    console.log(document.getElementById('inline-editor').onunload);
     */
});