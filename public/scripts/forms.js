//form stuff here

var availabilityWeekdayStart;
var availabilityWeekdayEnd;
var availabilitySaturdayStart;
var availabilitySaturdayEnd;
var availabilitySundayStart;
var availabilitySundayEnd;
var availability;

function setAvailability(hasAvailability,weekdayStart,weekdayEnd,saturdayStart,saturdayEnd,sundayStart,sundayEnd){
	if(hasAvailability){
		availabilityWeekdayStart = weekdayStart;
		availabilityWeekdayEnd = weekdayEnd;
		availabilitySaturdayStart = saturdayStart;
		availabilitySaturdayEnd = saturdayEnd;
		availabilitySundayStart = sundayStart;
		availabilitySundayEnd = sundayEnd;
	}
	availability = hasAvailability;
};



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

//Admin form booking submit
$(document).on("click","#adminFormSubmit",function(){
	let formData = $("#adminForm").serialize();
	$.ajax({
		url:"/booking/adminRequest",
		type:"POST",
		data:formData,
		async:false,
		success: function(data){
			//temporary, can be changed to something nicer
			alert("Successfully added booking");
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

//get pricing data, render on front end
$(document).on("change","#automatedForm",function(){
	let formData = $("#automatedForm").serialize();
	console.log(formData);
	$.ajax({
		url:"/booking/price",
		type:"GET",
		data:formData,
		async:false,
		success: function(price){
			$("#price").val("£" + price.toString());
			$('#price')[0].type = "text";
			$("#price-header").show();
		},
		error: function(error){
			console.log(error);
			$('#errMsg').text(error.responseText);
		}
	});
});

function addHour(time) {
	currentTime = parseInt(time.charAt(0) + time.charAt(1));
	newTime = (currentTime+1)%24;
	return newTime.toString();
}

function updateTimeRange(day){
	//reset times to avoid conficts
	$("#calendar").fullCalendar("option","minTime","00:00:00");
	$("#calendar").fullCalendar("option","maxTime","24:00:00");
	switch(day){
		//sunday
		case 0:
			//From time picker
			fp = document.querySelector("#time-from-input")._flatpickr;
			fp.set("minDate",availabilitySundayStart);
			fp.set("maxDate",availabilitySundayEnd);
			fp.setDate(availabilitySundayStart);
			//To time picker
			fp = document.querySelector("#time-to-input")._flatpickr;
			fp.set("minDate",availabilitySundayStart);
			fp.set("maxDate",availabilitySundayEnd);
			fp.setDate(addHour(availabilitySundayStart));
			//Facility schedule - ORDER IS IMPORTANT
			$("#calendar").fullCalendar("option","maxTime",availabilitySundayEnd);
			$("#calendar").fullCalendar("option","minTime",availabilitySundayStart);
			break;
		//saturday
		case 6:
			//From time picker
			fp = document.querySelector("#time-from-input")._flatpickr;
			fp.set("minDate",availabilitySaturdayStart);
			fp.set("maxDate",availabilitySaturdayEnd);
			fp.setDate(availabilitySaturdayStart);
			//To time picker
			fp = document.querySelector("#time-to-input")._flatpickr;
			fp.set("minDate",availabilitySaturdayStart);
			fp.set("maxDate",availabilitySaturdayEnd);
			fp.setDate(addHour(availabilitySaturdayStart));
			//Facility schedule - ORDER IS IMPORTANT
			$("#calendar").fullCalendar("option","maxTime",availabilitySaturdayEnd);
			$("#calendar").fullCalendar("option","minTime",availabilitySaturdayStart);
			break;
		//weekdays
		default:
			//From time picker
			fp = document.querySelector("#time-from-input")._flatpickr;
			fp.set("minDate",availabilityWeekdayStart);
			fp.set("maxDate",availabilityWeekdayEnd);
			fp.setDate(availabilityWeekdayStart);
			//To time picker
			fp = document.querySelector("#time-to-input")._flatpickr;
			fp.set("minDate",availabilityWeekdayStart);
			fp.set("maxDate",availabilityWeekdayEnd);
			fp.setDate(addHour(availabilityWeekdayStart));
			//Facility schedule - ORDER IS IMPORTANT
			$("#calendar").fullCalendar("option","maxTime",availabilityWeekdayEnd);
			$("#calendar").fullCalendar("option","minTime",availabilityWeekdayStart);
	}
};

function getTimeFromConfig(){
	return {
		enableTime: true,
		noCalendar: true,
		dateFormat: "H:i",
		time_24hr: true,
		defaultDate: "00:00",
		onChange(selectedDates, dateStr, instance){
			//stops user entering non hour time and times that have start time past the end time
			let timeFromInput = document.querySelector("#time-from-input")._flatpickr;
			let timeToInput = document.querySelector("#time-to-input")._flatpickr;
			let fromDate = new Date(selectedDates[0]);
			let toDate = new Date(timeToInput.selectedDates[0]);
			if (fromDate >= toDate){
				fromDate.setHours(toDate.getHours() - 1);
				fromDate.setMinutes(fromDate.getMinutes() + 30);
				fromDate.setMinutes(0);
				timeFromInput.setDate(fromDate);
			}
			else{
				fromDate.setMinutes(fromDate.getMinutes() + 30);
				fromDate.setMinutes(0);
				console.log(fromDate)
				timeFromInput.setDate(fromDate);
			}
		}
	};
};

function getTimeToConfig(){
	return {
		enableTime: true,
		noCalendar: true,
		time_24hr: true,
		dateFormat: "H:i",
		defaultDate: "01:00",
		onChange(selectedDates, dateStr, instance){
			//stops user entering non hour time and times that have start time past the end time
			let timeToInput = document.querySelector("#time-to-input")._flatpickr;
			let fromDate = new Date(selectedDates[0]);
			fromDate.setMinutes(fromDate.getMinutes() + 30);
			fromDate.setMinutes(0);
			timeToInput.setDate(fromDate);
		}
	};
};

function getCalendarConfig(){
	return {
		defaultView:"agendaDay",
		allDaySlot:false,
		height: "auto",
		header: {
			left: 'prev',
			center: 'title',
			right: 'next'
		},
		defaultDate: new Date().fp_incr(1),
		validRange: {
			start: new Date().fp_incr(1),
			end: new Date().fp_incr(60)
		},
		slotDuration: "01:00:00",
		slotLabelInterval: "01:00:00",
		events:{
			url: `/booking/availability/${$("#facility-input-id").val()}`,
			type: 'GET'
		}
	};
};

function getConfig(){
	return {
		minDate: new Date().fp_incr(1),
		maxDate: new Date().fp_incr(60), // 60 days from now
		dateFormat: "Y-m-d",
		defaultDate: new Date().fp_incr(1),
		onChange(selectedDates, dateStr, instance){
			updateTimeRange(selectedDates[0].getDay());
			$('#calendar').fullCalendar("gotoDate", dateStr);
		}
	};
};

$(document).ready(function(){
	// Date picker
	if(availability){
		$("#calendar").fullCalendar(getCalendarConfig());
		flatpickr("#date-input",getConfig());
		flatpickr("#time-from-input",getTimeFromConfig());
		flatpickr("#time-to-input",getTimeToConfig());
		updateTimeRange(new Date().getDay());

		$("#book-form").on("shown.bs.collapse", function () {
			$("#calendar").fullCalendar('rerenderEvents');
		});
	}
	
	$(document).on("click", ".fc-button", function(){
		let date = $("#calendar").fullCalendar("getDate").toDate();
		let picker = document.querySelector("#date-input")._flatpickr;
		picker.setDate(date);
		updateTimeRange(date.getDay());
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
