$(document).ready(function () {
	$(window).scroll(function () {
		if ($('body').width() <= 980)
			return;

		var X = $(this).scrollTop();
		if (X > 104) {
			$('.app-bar').css('display', 'none');
			$('.navbar-fixed-top').addClass('navbar-fixed');
			$('#main-contain').addClass('main-contain-fixed');
		} else {
			$('.app-bar').css('display', 'block');
			$('.navbar-fixed-top').removeClass('navbar-fixed');
			$('#main-contain').removeClass('main-contain-fixed');
		}
	})
})