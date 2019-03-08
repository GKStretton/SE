//form stuff here

var availabilityWeekdayStart;
var availabilityWeekdayEnd;
var availabilitySaturdayStart;
var availabilitySaturdayEnd;
var availabilitySundayStart;
var availabilitySundayEnd;
var availability;
var automated;
var noOptions;

function setAutomated(auto){
	automated = auto;
};

function setOptions(opt){
	options = !opt;
};

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

function addHour(time) {
	currentTime = parseInt(time.charAt(0) + time.charAt(1));
	newTime = (currentTime+1)%24;
	return newTime.toString();
};

function getRange(start,end,back){
	//strip minutes
	if(back){
		start = addHour(start);
		end = addHour(end);
	}
	start = start.charAt(0) + start.charAt(1) + ":00";
	end = end.charAt(0) + end.charAt(1) + ":00";
	let options = [];
	currentOption = start;
	while(currentOption !== end){
		options.push(currentOption);
		currentOption = addHour(currentOption) + ":00";
	}
	return options;
};

function getWeekdayRange(callback,back){
	options = getRange(availabilityWeekdayStart,availabilityWeekdayEnd,back);
	callback(options);
};

function getSaturdayRange(callback,back){
	options = getRange(availabilitySaturdayStart,availabilitySaturdayEnd,back);
	callback(options);
};

function getSundayRange(callback,back){
	options = getRange(availabilitySundayStart,availabilitySundayEnd,back);
	callback(options);
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

function getPrice(){
	let formData = $("#facility-input-id").serialize() + '&' + $("#time-from-input").serialize() + '&' + $("#time-to-input").serialize();
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
};

function setWeekday(id,back){
	$(id).empty();
	getWeekdayRange(function(options){
		for(var i=0;i<options.length;i++){
			$(id).append( $("<option>")
				.val(options[i])
				.html(options[i])
			);
		};
	},back);
};

function setSaturday(id,back){
	$(id).empty();
	getSatudayRange(function(options){
		for(var i=0;i<options.length;i++){
			$(id).append( $("<option>")
				.val(options[i])
				.html(options[i])
			);
		};
	},back);
};

function setSunday(id,back){
	$(id).empty();
	getSundayRange(function(options){
		for(var i=0;i<options.length;i++){
			$(id).append( $("<option>")
				.val(options[i])
				.html(options[i])
			);
		};
	},back);
};

function updateTimeRange(day){
	//reset times to avoid conficts
	$("#calendar").fullCalendar("option","minTime","00:00:00");
	$("#calendar").fullCalendar("option","maxTime","24:00:00");
	switch(day){
		//sunday
		case 0:
			if(automated){
				setSunday("#time-from-input",false);
				setSunday("#time-to-input",true);
			}
			
			//Facility schedule - ORDER IS IMPORTANT
			$("#calendar").fullCalendar("option","maxTime",availabilitySundayEnd);
			$("#calendar").fullCalendar("option","minTime",availabilitySundayStart);
			break;
		//saturday
		case 6:
			if(automated){
				setSaturday("#time-from-input",false);
				setSaturday("#time-to-input",true);
			}
			
			//Facility schedule - ORDER IS IMPORTANT
			$("#calendar").fullCalendar("option","maxTime",availabilitySaturdayEnd);
			$("#calendar").fullCalendar("option","minTime",availabilitySaturdayStart);
			break;
		//weekdays
		default:
			if(automated){
				setWeekday("#time-from-input",false);
				setWeekday("#time-to-input",true);
			}
			//Facility schedule - ORDER IS IMPORTANT
			$("#calendar").fullCalendar("option","maxTime",availabilityWeekdayEnd);
			$("#calendar").fullCalendar("option","minTime",availabilityWeekdayStart);
	}
};

$("#time-from-input").change(function() {
	console.log("changing from");
	let from = this.selectedIndex;
	let to = $("#time-to-input").prop("selectedIndex");
	if(from > to){
		if((to-1) < 0){
			this.prop("selectedIndex",0);
			$("#time-to-input").prop("selectedIndex",1)
		}else{
			this.prop("selectedIndex",to-1);
		}
	}
});

$("#time-to-input").change(function() {
	console.log("changing from");
	let to = this.selectedIndex;
	let from = $("#time-from-input").prop("selectedIndex");
	let len = $('#time-from-input > option').length;
	if(to < from){
		if(to+1 > length-1){
			this.prop("selectedIndex",len-1);
			$("#time-from-input").prop("selectedIndex",len-2)
		}else{
			this.prop("selectedIndex",from+1);
		}
	}
});

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
			end: new Date().fp_incr(61)
		},
		slotDuration: "00:30:00",
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
	if(availability && noOptions){
		$("#calendar").fullCalendar(getCalendarConfig());
		flatpickr("#date-input",getConfig());
		updateTimeRange(new Date().getDay())
		$("#book-form").on("shown.bs.collapse", function () {
			$("#calendar").fullCalendar('rerenderEvents');
		});
	}
});

//get pricing data, render on front end
$(document).on("change","#automatedForm",function(){
	getPrice();
});

$(document).on("click", "#btn-book-form", function(){
	getPrice();
});

$(document).on("click", ".fc-button", function(){
	let date = $("#calendar").fullCalendar("getDate").toDate();
	if(automated){
		let picker = document.querySelector("#date-input")._flatpickr;
		picker.setDate(date);
	}
	if(noOptions){
		updateTimeRange(date.getDay());
	}
	
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
