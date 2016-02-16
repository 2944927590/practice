
var album = a = function() {

	var hoverA = function() {
		var m_h_d = $(".mod-hover-droplist");
		$("#hover-droplist").hover(function() {
			m_h_d.show();
			m_h_d.find("ul").slideDown();
		}, function() {
			m_h_d.find("ul").delay(500).slideUp(function(){
				m_h_d.hide();
			});
		});
	}
	return {
		init: function() {
			hoverA();
		}
	}
}();
