(function($) { 
	var privateFun = function() {
		
	}
	var PageSwitch = (function() {
		function PageSwitch(element, options) {
			this.settings = $.extend(true, $.fn.PageSwitch.default, options || {});
			this.element = element;
			this.init();
		}
		PageSwitch.prototype = {
			init: function() {

			}
		}
		return PageSwitch;
	})();

	$.fn.PageSwitch = function(options) {
		return this.each(function() {
			var me = $(this),
				instance = me.data("PageSwitch");
			if(!instance){
				instance = new PageSwitch(me, options);
				me.data("PageSwitch", instance);
			}
			if($.type(options) === "string") return instance[options]();
			//比如页面中调用init方法 $("div").PageSwitch("init");
		});
	}
	$.fn.PageSwitch.default = {
		selectors: {
			sections: ".sections",
			section: ".section",
			page: ".page",
			active: ".active"
		},
		index: 0,
		easing: "ease",
		duration: 500,
		loop: false,
		pagination: true,
		keyboard: true.
		diretion: "veltical",
		callback: ""
	}
})(jQuery);