$(function () {
    // Foundation by Zurb Navigation
    // Will be swapped out for Prime Navigation.

    $(document).foundationNavigation();

    // Navigation Toggle

    var ww = document.body.clientWidth;

        $(function () {
            adjustNavigation();
        });

        $(window).bind('resize orientationchange', function () {
            ww = document.body.clientWidth;
            adjustNavigation();
        });

        function adjustNavigation() {
            var ww = document.body.clientWidth;

            $('.nav-toggle').click(function () {
                $(this).toggleClass('toggled');
                $('.nav-bar').toggle();

                if ($(this).hasClass('toggled')) {
                    $(this).html('Hide Navigation');
                } else {
                    $(this).html('Show Navigation');
                }
            });

            if (ww > 767) {
                $('.nav-toggle').css("display", "none");
                $('.nav-bar').show();
            } else {
                $('.nav-toggle').css("display", "inline-block");
                if (!$('.nav-toggle').hasClass('toggled')) {
                    $('.nav-bar').hide();
                } else {
                    $('.nav-bar').show();
                }
            }
        }
});