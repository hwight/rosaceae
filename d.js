$(window).on('load',function(){
		alert("BEFORE ENTER clicked");
        $('#myModal').modal('show');
        $('#enter').click(function() {
        	$('#myModal').modal(data-backdrop="static")
    		$('#myModal').modal('hide');
		});
});

