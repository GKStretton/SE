//form stuff here
$(document).on("click","#automatedFormSubmit",function(){
	let formData = $("#automatedForm").serialize();
		$.post("/booking/lockRequest",formData,function(data){
			window.location.replace("/payment");
	})
	.fail(function(res){
		console.log(res);
		$('#errMsg').text(res.responseText);
	})
});


$(document).ready(function(){
	flatpickr("#date-input",{
    minDate: "today",
    maxDate: new Date().fp_incr(60), // 60 days from now
    dateFormat: "Y-m-d",
});
});