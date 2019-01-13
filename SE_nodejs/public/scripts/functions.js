//can change this to a button listener if you want
function toggleVisability(id){
	var doc = document.getElementById(id);
       if(doc.style.display == 'block')
          doc.style.display = 'none';
       else
          doc.style.display = 'block';
};

function changeGalleryImage(s){
	document.getElementById("facility-gallery-image").src = s;
	document.getElementById("facility-gallery-fancybox").href = s;
};

$(document).ready(function() {
	$('.fancybox').fancybox();
});