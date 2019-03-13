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

$(document).ready(function() {
	$("#events-photos").carousel({interval: 2000});
});