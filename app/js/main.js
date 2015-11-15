$(document).ready(function() {

	// Animated Hamburger Menu
	$('.hamburger-menu').on('click', function() {
		$('.bar').toggleClass('animate-bar');
		$('.menu-nav').slideToggle();
		return false;
	});

	$('.footer-hamburger-menu').on('click', function() {
		$('.footer-bar').toggleClass('footer-animate-bar');
		$('.footer-nav').slideToggle();
		return false;
	});

	// Попап для логина
	$('.enter a, .forgot, .to-form, .back-to').magnificPopup({
		type:'inline',
		mainClass: 'mfp-form'
	});

	// Переключение табов в попапе
	$(".log-tabs").lightTabs();

	// Слайдер http://www.owlcarousel.owlgraphic.com/
	$(".owl-carousel").owlCarousel({
		items:1,
		loop:true,
		nav:true,
		autoHeight:true,
		// autoplay:true,
		autoplayHoverPause:true,
		navText:false,
		lazyLoad:true,
		smartSpeed:450
	});

	//SVG Fallback
	if(!Modernizr.svg) {
		$("img[src*='svg']").attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	};

	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	};

	$("img, a").on("dragstart", function(event) { event.preventDefault(); });

});

// Работа табов в попапе логина
(function($){
	jQuery.fn.lightTabs = function(options){

		var createTabs = function(){
			tabs = this;
			i = 0;

			showPage = function(i){
				$(tabs).children("div").children("div").hide();
				$(tabs).children("div").children("div").eq(i).show();
				$(tabs).children("ul").children("li").removeClass("active");
				$(tabs).children("ul").children("li").eq(i).addClass("active");
			}

			showPage(0);

			$(tabs).children("ul").children("li").each(function(index, element){
				$(element).attr("data-page", i);
				i++;
			});

			$(tabs).children("ul").children("li").click(function(){
				showPage(parseInt($(this).attr("data-page")));
			});
		};
		return this.each(createTabs);
	};
})(jQuery);