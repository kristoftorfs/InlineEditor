// Fix for showing TinyMCE in a jQuery UI dialog
$(document).on('focusin', function(e) {
    if ($(event.target).closest(".mce-window").length) {
        e.stopImmediatePropagation();
    }
});

// Iframe sizing
$('document').ready(function() {
    $('p.pageback').remove();
    $(window).resize(function() {
        var height = $('footer').offset().top - $('#inline-editor-frame').offset().top - 10;
        $('iframe#inline-editor').height(height);
    });
    $(window).resize();
});