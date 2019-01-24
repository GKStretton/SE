//form stuff here
$(document).on("click","#automatedFormSubmit",function(){
	let formData = $("#automatedForm").serialize();
		$.post("/booking/lockRequest",formData,function(data){
			location.assign("/payment");
	})
	.fail(function(res){
		console.log(res);
		$('#errMsg').text(res.responseText);
	})
});

$(document).on("click","#manualFormSubmit",function(){
	let formData = $("#manualForm").serialize();
	$.post("/booking/enquiry",formData,function(data){
		location.assign("/booking/enquiry/success");
	})
	.fail(function(res){
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

// contact-us form
$(document).on("click", "#contactSubmit", function() {
	let formData = $("#contactForm").serialize();
	$.post("/contact-us/submit", formData, function(data) {
		$("#feedback").text("Message sent");
		$("#contactSubmit").remove();
	}).fail(function(res) { // Not currently used
		$("#feedback").attr("class", "text-danger");
		$("#feedback").text("\t" + res.responseText);
	});
});
