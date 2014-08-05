/**
	* @function bdvCarousel
	* @param  {String|HTMLElement} el 一个包含Carousel所需结构的容器对象.
	* @param  {Object} options 选项.
	* @config {Number} originalIndex 默认选项卡的聚焦项，默认0.
	* @config {Number} viewSize 描述一页显示多少个滚动项，默认值是3
        * @config {Object} focusRange 描述焦点在viewSize参数中的滚动范围，最小值从0开始，格式：{min: 0, max: 4}，当焦点超出focusRange指定的范围时才会触发滚动动作.
        * @config {Boolean}isLoop 是否支持循环滚动，默认true
        * @config {Number} step 描述每次调用focusPrev或focusNext方法时一次滚动过多少个项，默认是滚动1项
	* @config {String} animate    描述滚动的效果，取值{slide2dHorizontal|slide2dVertical|slide3dHorizontal|slide3dVertical|fade}，分别是2d水平（垂直）滑动、3d水平（垂直）滑动与淡入淡出， 默认是slide2dHorizontal
	* @config {Boolean}autoScroll 描述是否支持自动滚动，默认true
	* @config {Number} interval  描述两次滚动的时间间隔，默认3000毫秒
	* @config {Number} duration  描述每次滚动花费的时间，默认500毫秒
	* @config {String} direction 取值{forward|backward}，描述向前滚动还是向后滚动，默认forward
	* @config {Number} containerWidth 描述每一屏的宽度，默认984 
	* @config {Number} containerHeight 描述每一屏的宽度，默认500
	* @config {Boolean} lazyload  是否开启图片懒加载 默认false 

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
            $(this).data("bdvCarousel", carousel);
        });
	};
	$.fn.bdvCarousel.options = {
		originalIndex : 0,
		viewSize : 3,
		isLoop : true,
		step : 1,
		containerWidth : 984,
		containerHeight : 500,
		outContainer : 984,
		animate : 'slide2dHorizontal',
		autoScroll : true,
		interval : 3000,
		duration : 500,
		direction : 'forward',
		lazyload : false

	};
	var Carousel = {
		// 初始化
		init : function(options, el) {
			var self = this;
			//容器
			self.$elm = $(el);
			
			//容器节点
			self.$carouselList = $(".carousel li");

			//控制点
			self.$dotList = $(".carousel-dot li");
			
			//屏数
			self.num = self.getTotalCount();

			self.options = $.extend({}, $.fn.bdvCarousel.options, options);

			/**
				* @vars   {Number}  pos        定义焦点区所在位置
				* @vars   {String}  direction  定义滚动的方向
				* @vars   {Number}  offsetSize 定义每一屏的大小{宽|高}
				* @vars   {Number}  maxSize    定义容器的整体大小
			**/
			self.axis = {
				slide2dHorizontal : {
					pos : self.options.containerWidth * self.options.originalIndex,
					direction : "left",
					offsetSize : self.options.containerWidth,
					maxSize : self.options.containerWidth * self.num

				},
				slide2dVertical : {
					pos : self.options.containerHeight * self.options.originalIndex,
					direction : "top",
					offsetSize : self.options.containerHeight,
					maxSize : self.options.containerHeight * self.num
				}
			}

			//如果是slide效果
			if(self.options.animate.indexOf("slide") != -1) {

				self.initData = self.axis[self.options.animate];

				if(self.options.animate =="slide2dHorizontal") {
					self.$elm.css("width", self.initData.maxSize);
				}
				if(self.options.animate =="slide2dVertical") {
					self.$elm.css("height", self.initData.maxSize);
				}
				if(self.options.animate == "slide3dHorizontal") {
					self.$elm.children("li").each(function(i, n){
						if(i == (self.options.originalIndex + self.num- 1) % self.num) {
							$(n).css({
								"position" : "absolute",
								"width" : self.options.containerWidth * 0.8,
								"height" : self.options.containerHeight * 0.8,
								"margin-top" : self.options.containerHeight * 0.1,
								"left" : 0,
								"opacity" : 0.5,
								"z-index" : 0
							});
						}else if(i == self.options.originalIndex){
							$(n).css({
								"position" : "absolute",
								"width" : self.options.containerWidth,
								"height" : self.options.containerHeight,
								"left" : (self.options.outContainer - self.options.containerWidth)/2,
								"opacity" : 1,
								"z-index" : 3
							});
						}else if(i == (self.options.originalIndex + 1) % self.num) {
							$(n).css({
								"position" : "absolute",
								"width" : self.options.containerWidth * 0.8,
								"height" : self.options.containerHeight * 0.8,
								"margin-top" : self.options.containerHeight * 0.1,
								"left" : (self.options.outContainer + self.options.containerWidth)/2,
								"opacity" : 0.5,
								"z-index" : 0
							});
						}else {
							$(n).css({
								"position" : "absolute",
								"width" : self.options.containerWidth * 0.8,
								"height" : self.options.containerHeight * 0.4,
								"left" : 0 - self.options.containerWidth * 0.8,
								"margin-top" : self.options.containerHeight * 0.3,
								"opacity" : 0,
								"z-index" : 0
							});
						}

					})
				}
			}else {
				//淡入淡出效果
				self.$elm.css("width", self.options.containerWidth);
				self.$elm.css("position", "relative");
				$(".carousel li").each(function(i,n){
					$(n).css({
						"float" : "none",
						"position" : "absolute",
						"left" : 0,
						"top" : 0,
						"opacity" : 0
					});
					if(i == self.options.originalIndex) {
						$(n).css("opacity",1);
					}
				})
			}
			self.start();
		},

		//渲染
		render : function() {
			var self = this;
			//self.$elm.children("li").eq(0).attr("");
		},
		
		//开始轮播
		start : function() {
			var self = this;

			if(self.options.autoScroll) {
				self.pid = setInterval(function() {
					if(self.options.direction == "forward")
						self.next();
					else 
						self.prev();		
				}, self.options.interval)
			}
		},
		
		//暂停轮播
		stop  : function() {
			var self = this;
			
			if(self.options.autoScroll) {
				clearInterval(self.pid);
			}
		},

		//定位到N个元素
		//@param {Number} index  元素的索引值 0,1,2,3....
		goTo : function(index) {
			var self = this;
			self.stop();
			if(self.options.animate.indexOf("slide") != -1) {
				self.initData.pos = 0 - self.initData.offsetSize * index;
				self.animate();
			}else{
				self.fadeAnimate(self.getCurrentIndex(), index);
			}
			self.start();
		},
		
		//一次滚动完成后的回调
		focused : function() {
			console.log("complete");
		},

		//以step为单位翻到下一项
		next : function() {
			var self = this;

			//手动滚动时先暂停
			self.stop();

			var curIndex = self.getCurrentIndex(),
				nextIndex = (curIndex + 1) % 5;

			self.$dotList.eq(curIndex).removeClass("item-selected");
			self.$dotList.eq(nextIndex).addClass("item-selected");

			if(self.options.animate == "slide2dHorizontal" || self.options.animate == "slide2dVertical") {
				self.initData.pos -= self.initData.offsetSize;

				if(Math.abs(self.initData.pos) >= self.initData.maxSize){
					self.initData.pos = 0;
				}
				self.animate();
		  	}else if(self.options.animate == "fade"){
		  		self.fadeAnimate(curIndex, nextIndex);
		  	}else if(self.options.animate == "slide3dHorizontal"){
		  		self.galleryAnimate((curIndex-1 + 5) % 5, curIndex, nextIndex);
		  	}

			self.start();

		},

		//以step为单位翻到上一项
		prev : function() {
			var self = this;
			self.stop();
			var curIndex = self.getCurrentIndex(),
				nextIndex = (curIndex + 5 - 1) % 5;

			self.$dotList.eq(curIndex).removeClass("item-selected");
			self.$dotList.eq(nextIndex).addClass("item-selected");

			if(self.options.animate == "slide2dHorizontal" || self.options.animate == "slide2dVertical") {
				self.initData.pos += self.initData.offsetSize;

				if(self.initData.pos > 0){
					self.initData.pos = self.initData.offsetSize - self.initData.maxSize;
				}
				self.animate();
				self.start();
			}else if(self.options.animate == "fade"){
		  		self.fadeAnimate(curIndex, nextIndex);
		  	}else if(self.options.animate == "slide3dHorizontal"){
		  		self.galleryAnimate((curIndex + 1) % self.num, curIndex, nextIndex);
		  	}

		},

		//取得当前得到焦点项在所有数据项中的索引值
		getCurrentIndex : function() {
			return $(".carousel-dot li").index($(".item-selected"))
		},

		//取得数据项的总数目
		getTotalCount : function(){
			return $(".carousel").children().length;
		},

		//动画函数
		animate : function() {
			var self = this;
			// @vars {String}    self.direction  {left|top}               根据滚动效果决定方向
			// @vars {String}    self.size       {self.options.containerWidth|
			//									  self.options.containerHeight} 根据滚动方向决定用宽度还是高度值 																							 
			var animateData = {};
			animateData[self.initData.direction] = self.initData.pos + "px";
			self.$elm.animate(animateData, self.options.duration, self.focused());
		},

		//淡入淡出函数
		// @param  {Number}  curIndex  当前选中项
		// @param  {Number}  nextIndex  下一选中项
		fadeAnimate : function(curIndex, nextIndex) {
			var self = this;
			self.$carouselList.eq(curIndex).animate({
		  			opacity : 0
		  		});
		  	self.$carouselList.eq(nextIndex).animate({
		  		opacity :1
		  	});
		},
		//
		galleryAnimate : function(prevIndex, curIndex, nextIndex){
			var self = this;
			var pprevIndex = (prevIndex + 5 -1) % 5;
			self.$elm.children("li").eq(prevIndex).animate({
				"width" : self.options.containerWidth * 0.8,
				"height" : self.options.containerHeight * 0.8,
				"margin-top" : self.options.containerHeight * 0.1,
				"left" : 0,
				"opacity" : 0.5,
				"z-index" : 0
			});
			self.$elm.children("li").eq(prevIndex).animate({
				"width" : self.options.containerWidth,
				"height" : self.options.containerHeight,
				"left" : (self.options.outContainer - self.options.containerWidth)/2,
				"opacity" : 1,
				"z-index" : 3
			});
			self.$elm.children("li").eq(curIndex).animate({
				"width" : self.options.containerWidth * 0.8,
				"height" : self.options.containerHeight * 0.8,
				"margin-top" : self.options.containerHeight * 0.1,
				"left" : (self.options.outContainer + self.options.containerWidth)/2,
				"opacity" : 0.5,
				"z-index" : 0
			});
			self.$elm.children("li").eq(nextIndex).animate({
				"width" : self.options.containerWidth * 0.8,
				"height" : self.options.containerHeight * 0.4,
				"left" : 0 - self.options.containerWidth * 0.8,
				"margin-top" : self.options.containerHeight * 0.3,
				"opacity" : 0,
				"z-index" : 0
			});
		}
	};
}(jQuery))
