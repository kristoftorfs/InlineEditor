$('document').ready(function() {
    $('p.pageback').remove();
    $(window).resize(function() {
        var height = $('footer').offset().top - $('iframe#inline-editor').offset().top - 10;
        $('iframe#inline-editor').height(height);
    });
    $(window).resize();
});