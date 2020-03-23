(function ($) {
	$(function () {

		var btn = $('#button-to-top');

        $(window).scroll(function () {
            if ($(window).scrollTop() < 800) {
                btn.css("opacity", 0);
                btn.css("visibility", "hidden");
            } else {
                btn.css("opacity", 1);
                btn.css("visibility", "visible");
            }
        });

        btn.on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, '300');
        });
        
		$('.banner-slider').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			arrows: true,
			autoplaySpeed: 2000,
		});

		$(".match__main").click(function () {
			let wrapper = $(this).parents('.match__wrapper');
			$('.match__main-content').not(wrapper.children('.match__main-content')).slideUp();
			wrapper.children('.match__main-content').slideToggle();
		});

		$(".match__streams").find(".stream__option:first").addClass("selected");

        $(".stream__option").click(function () {
            $(".stream__option.selected").removeClass("selected");
            $(this).parent().parent().find('iframe').attr("src", `https://player.twitch.tv/?channel=${this.title}&muted=true`);
            $(this).addClass("selected");
        });
    }); // end of document ready
})(jQuery); // end of jQuery name space