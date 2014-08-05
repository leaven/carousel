/**
	* @function bdvCarousel
	* @param  {String|HTMLElement} el 一个包含Carousel所需结构的容器对象.
	* @param  {Object} options 选项.
	* @config {Number} orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：{horizontal: 横向, vertical: 竖向}，默认是horizontal.
	* @config {Number} originalIndex 默认选项卡的聚焦项，默认0.
	* @config {Number} viewSize 描述一页显示多少个滚动项，默认值是3
        * @config {Object} focusRange 描述焦点在viewSize参数中的滚动范围，最小值从0开始，格式：{min: 0, max: 4}，当焦点超出focusRange指定的范围时才会触发滚动动作.
        * @config {Boolean}isLoop 是否支持循环滚动，默认true
        * @config {Number} step 描述每次调用focusPrev或focusNext方法时一次滚动过多少个项，默认是滚动1项
	* @config {String} animate    描述滚动的效果，取值{slide2d|slide3d|fade}，分别是2d滑动、3d滑动与淡入淡出， 默认是slide
	* @config {Boolean}autoScroll 描述是否支持自动滚动，默认true
	* @config {Number} interval  描述两次滚动的时间间隔，默认3000毫秒
	* @config {Number} duration  描述每次滚动花费的时间，默认500毫秒
	* @config {String} direction 取值{backward|forward}，描述向前滚动还是向后滚动，默认backward

**/

(function($){

	if (typeof Object.create !== "function") {
	    Object.create = function (obj) {
	        function F() {}
	        F.prototype = obj;
	        return new F();
	    };
	}
	$.fn.bdvCarousel = function(options) {
		return this.each(function () {
            if ($(this).data("bdvcarousel-init") === true) {
                return false;
            }
            $(this).data("bdvcarousel-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "bdvCarousel", carousel);
        });
	};
	$.fn.bdvCarousel.options = {
		orientation : 'horizontal',
		originalIndex : 0,
		viewSize : 3,
		isLoop : true,
		step : 1,
		effect : 'slide2d',
		autoScroll : true,
		interval : 3000,
		duration : 500,
		direction : 'backward'
	};
	var Carousel = function() {
		// 初始化
		init : function(opts, el) {
			var self = this;
			self.$elm = $(el);
			self.options = $.extend({}, $.fn.bdvCarousel.options, self.$elem.data(), options);
		},
		
		//开始轮播
		start : function() {
			
		},
		
		//暂停轮播
		stop  : function() {},

		//定位到N个元素
		//@param {Number} index  元素的索引值
		goTo : function() {},
		
		//一次滚动完成后的回调
		focused : function() {},

		//以step为单位翻到下一项
		next : function() {},

		//以step为单位翻到上一项
		prev : function() {},

		//取得当前得到焦点项在所有数据项中的索引值
		getCurrentIndex : function() {},

		//取得数据项的总数目
		getTotalCount : function(){}
	};
}(jQuery))
