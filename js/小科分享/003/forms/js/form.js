var reg = r =function() {
	var handleInput = function(){
		var oInput = $("#homyit-reg input");
		oInput.each(function(k, v){
			$(this).focus(function(){
				console.log(1);
			});
		});
	}
	return {
		init: function(){
			handleInput();
		}
	}
}();
reg.init();