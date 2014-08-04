/**
	* @function bdvTabSlider
	* @param  {object}      options
	* @config {Number}      orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：{horizontal: 横向, vertical: 竖向}，默认是horizontal.
	* @config {Number}      originalIndex 默认选项卡的聚焦项，默认0. 
	* @config {Number}      viewSize 
	* @config {String}      {direction}   {backward|forward}
	* @config {Boolean}     autoSlider
	* @config {String}      {animation}   {slide|fade}
	* @config {Number}      {interval}   default 5000
	* @config {Number}      {duration}   default 500




**/

(function($) {
	$.fn.bdvTabSlider = function(options) {

	}
	$.fn.bdvTabSlider.options = {
		direction : 'backward',
		autoSlider : true,
		animation : 'slide'
	};
	var tabSlider  = function() {
		init : function(options, el) {},
		prev : function() {},
		next : function() {},
		getCurrentIndex : function() {},
		goTo : function(index) {},
		animate : function() {}
	}
}(jQuery))