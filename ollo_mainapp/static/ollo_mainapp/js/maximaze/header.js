$(function() {
	
	/* Menu nav toggle */

	$("#nav__toggle").on("click", function(){
		event.preventDefault();

		$("#nav").toggleClass("active");
		$(this).toggleClass("active");
	});

});