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

	// Слайдер http://www.owlcarousel.owlgraphic.com/
	$(".owl-carousel").owlCarousel({
		items:1,
		loop:true,
		nav:true,
		autoHeight:true,
		autoplay:true,
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