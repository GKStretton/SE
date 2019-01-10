//can change this to a button listener if you want
function toggleVisability(id){
	var doc = document.getElementById(id);
       if(doc.style.display == 'block')
          doc.style.display = 'none';
       else
          doc.style.display = 'block';
};

$(document).on("click","#automatedFormSubmit",function(){
	let formData = $("#automatedForm").serialize();
		$.post("/booking/lockRequest",formData,function(data){
	})
	.fail(function(res){
		console.log(res);
		$('#errMsg').text(res.responseText);
	})

});