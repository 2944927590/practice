var Page = P = function() {

	var firstRow;
	var listRows;
	var parameter;
	var totalRows;
	var totalPages;
	var rollPage = 6;
	var lastSuffix = true;

	var _p = "p";
	var _url = location.href;
    console.log(_url);
	var _nowPage = 1;

	var _configs = {
		'header': '<span class="rows">共 {:TOTAL_ROW} 条记录</span>',
         'prev'  : '<<',
        'next'  : '>>',
        'first' : '1...',
        'last'  : '...{:TOTAL_PAGE}',
        'theme' : '{:FIRST} {:UP_PAGE:} {:LINK_PAGE} {:DOWN_PAGE} {:END}'
	};



	return {
		init: function() {

		}
	}
}();