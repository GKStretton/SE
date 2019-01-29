//can change this to a button listener if you want
function toggleVisability(id){
	var doc = document.getElementById(id);
		if(doc.style.display == 'block')
			doc.style.display = 'none';
		else
			doc.style.display = 'block';
};

// For facility carousel and rss div
$(document).ready(function() {
	$("#facility-photos").carousel({interval: 2000});
});

// what's on functionality
$(document).ready(function() {
	$('#adultTab').hide();
});

$(document).on("click", "#childTabButton", function() {
	$('#childTab').show();
	$('#adultTab').hide();
});

$(document).on("click", "#adultTabButton", function() {
	$('#childTab').hide();
	$('#adultTab').show();
});
