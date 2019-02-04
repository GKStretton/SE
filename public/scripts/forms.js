//form stuff here

//Automated booking submit
$(document).on("click","#automatedFormSubmit",function(){
	let formData = $("#automatedForm").serialize();
	$.ajax({
		url:"/booking/lockRequest",
		type:"POST",
		data:formData,
		async:false,
		success: function(data){
			let tab = window.open("","_blank");
			tab.location.assign("/payment");
			location.reload();
		},
		error: function(error){
			console.log(error);
			$('#errMsg').text(error.responseText);
		}
	});
});


//Manual form submit
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
	// Date picker
	flatpickr("#date-input",{
		minDate: "today",
		maxDate: new Date().fp_incr(60), // 60 days from now
		dateFormat: "Y-m-d",
		defaultDate: new Date(),
		onChange(selectedDates, dateStr, instance){
			$('#calendar').fullCalendar("gotoDate", dateStr);
		},
	});

	//From time picker
	flatpickr("#time-from-input",{
		enableTime: true,
		noCalendar: true,
		dateFormat: "H:i",
		defaultDate: "12:00"
	});

	//To time picker
	flatpickr("#time-to-input",{
			enableTime: true,
			noCalendar: true,
			dateFormat: "H:i",
			defaultDate: "13:00"
	});

	//Facility schedule
	$("#calendar").fullCalendar({
		defaultView:"agendaDay",
		allDaySlot:false,
		header: {
			left: 'prev',
			center: 'title',
			right: 'next'
		},
		minTime: "00:00:00",
		maxTime: "24:00:00",
		slotDuration: "00:30:00",
		slotLabelInterval: "01:00",
		events:{
			url: `/booking/availability/${window.location.pathname.split("/").pop()}`,
			type: 'GET'
		}
	});

	$("#book-form").on("shown.bs.collapse", function () {
		$("#calendar").fullCalendar('rerenderEvents');
	});
});

//Booking form show button

// contact-us form
$(document).on("click", "#contactSubmit", function() {
	let formData = $("#contactForm").serialize();
	$.post("/contact-us/submit", formData, function(data) {
		$("#feedback").text("Message sent");
		$("#contactSubmit").remove();
	}).fail(function(res) { // Not currently used
		console.log("FAIL");
		$("#feedback").attr("class", "text-danger");
		$("#feedback").text("\t" + res.responseText);
	});
});