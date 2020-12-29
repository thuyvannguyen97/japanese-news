$(function(){
	$('[data-toggle="tooltip"]').tooltip();
	
	$(".fillter_width_url").change(function(){
		var url = $(this).val();
		if(url != ""){
			return window.location.href = url;
		}
	});
});