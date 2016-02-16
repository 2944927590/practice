
var cicle = cle = function() {
	
	var oTx = $(".tx");

	var cicleTransform = function(num, old_num) {
		var b_l_a = $(".bar-left-an");
		var b_r_a = $(".bar-right-an");
		var c_num = num;
		if(c_num > 50) {
			b_r_a.css({
				"transform": "rotate(45deg)",
				"transition": "transform 1s linear"
			});
			setTimeout(function() {
				b_l_a.css({
					"transform": "rotate(" + (((c_num-50)/100*360)-135) + "deg)",
					"transition": "transform 1s linear"
				});
			},1000);
		} else {
			if(old_num > 50) {
				setTimeout(function() {
					b_r_a.css({
						"transform": "rotate(" + ((c_num/100*360)-135) + "deg)",
						"transition": "transform 1s linear"
					});
				},1000);
				b_l_a.css({
					"transform": "rotate(-135deg)",
					"transition": "transform 1s linear"
				});
			} else {
				b_r_a.css({
					"transform": "rotate(" + ((c_num/100*360)-135) + "deg)",
					"transition": "transform 1s linear"
				});
			}
			
		}
	}

	var setnum = function(num) {
		oTx.text(num + "%");
	}

	var getnum = function() {
		return parseInt(oTx.text());
	}

	var inputB = function() {
		$("#inp").blur(function() {
			var num = parseInt($.trim( $(this).val() ));
			if(num>=0 && num <= 100){
				cicleTransform(num, getnum());
				setnum(num);
			}else{
				alert("输入100以内的数值！");
			}
		});
	}
	
	return {
		init: function() {
			inputB();
		}
	}
}();