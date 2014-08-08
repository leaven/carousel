/**
	* @autor liwei
	* @date   2014/08/05
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
	* @config {Number} outContainerWidth 描述外部容器宽度，默认984(3D滚动专用)
	* @config {Number} containerWidth 描述每一屏的宽度，默认984 
	* @config {Number} containerHeight 描述每一屏的宽度，默认500
	* @config {Boolean} lazyload  是否开启图片懒加载 默认false
	* @config {Function} beforeRender 每次轮播前回调
	* @config {Function}  afterRender  每次轮播后回调
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
		containerWidth : 984,
		containerHeight : 500,
		outContainerWidth : 984,
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
			//大容器
			self.$container = $(el);

			//内容容器
			self.$elm = self.$container.find(".bdv-carousel-list");
			

			//控制容器
			self.$dotList = self.$container.find(".bdv-carousel-dot");
			
			//屏数
			self.num = self.getTotalCount();

			self.options = $.extend({}, $.fn.bdvCarousel.options, options);

			//回调函数
			self.beforeRender = self.options.beforeRender || function() {};

			self.afterRender = self.options.afterRender || function() {};

			//初始化组件,必须在self.options之后
			self.resetCarousel();

			//事件注册
			self.eventHandler();
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

			//slide效果
			if(self.options.animate.indexOf("slide") != -1) {

				self.initData = self.axis[self.options.animate];

				if(self.options.animate =="slide2dHorizontal") {
					console.log(self.initData.maxSize);
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
								"left" : (self.options.outContainerWidth - self.options.containerWidth)/2,
								"opacity" : 1,
								"z-index" : 3
							});
						}else if(i == (self.options.originalIndex + 1) % self.num) {
							$(n).css({
								"position" : "absolute",
								"width" : self.options.containerWidth * 0.8,
								"height" : self.options.containerHeight * 0.8,
								"margin-top" : self.options.containerHeight * 0.1,
								"left" : (self.options.outContainerWidth + self.options.containerWidth)/2,
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
			}
			if(self.options.animate == "fade") {
				//淡入淡出效果
				self.$elm.css("width", self.options.containerWidth);
				self.$elm.css("position", "relative");
				self.$elm.children("li").each(function(i,n){
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
			if(self.options.animate == "tab") {
				self.$elm.children("li").eq(self.options.originalIndex).show();
			}
			self.start();
		},
		//事件中心
		eventHandler : function() {
			var self = this;
			var $controlContainer = self.$container.find(".bdv-carousel-control");
			if(!$controlContainer) return;

			//注册圆点点击
			if(self.$dotList) {
				self.$dotList.on("click", function(event) {
					var se = $(event.target);
					if(se[0].nodeName != "LI") {
						se = se.parents("li");
					}
	                //if(se[0].nodeName !="LI")return;
	                
	                self.goTo(self.$dotList.children("li").index(se[0]));

	                se.addClass("dot-selected").siblings("li").removeClass("dot-selected");
					});
			}
			//前进后退按钮
			//设定一个时间间隔，在此间隔内的点击无效
			var prevTime = new Date().getTime();
			self.$container.find(".bdv-carousel-prev").on("click", function() {
				var curTime = new Date().getTime();
				if((curTime - prevTime) < (self.options.duration - 100))return;
				prevTime = curTime;
				self.prev();
			})
			self.$container.find(".bdv-carousel-next").on("click", function() {
				var curTime = new Date().getTime();
				if((curTime - prevTime) < (self.options.duration - 100))return;
				prevTime = curTime;
				self.next();
			})
		},
		//获取首次加载的时候控制点所在的位置
		resetCarousel : function() {
			var self = this;

			if(self.$dotList) {
				self.$dotList.children("li").eq(self.options.originalIndex).addClass("dot-selected");
			}
			self.$elm.children("li").eq(self.options.originalIndex).addClass("item-selected")

		},
		//图片懒加载函数，替换其中的data-src值
		lazyLoadImg : function(index) {
			var self = this;

			var img = self.$elm.children("li").eq(index).children("img")[0];
			if(!$(img).attr("src")) {
				$(img).attr("src", $(img).attr("data-src"));
				$(img).removeAttr("data-src");
			}
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

			var curIndex = self.getCurrentIndex();
			self.$elm.children("li").eq(curIndex).removeClass("item-selected");
			self.$elm.children("li").eq(index).addClass("item-selected");

			if(self.$dotList) {
				self.$dotList.children("li").eq(curIndex).removeClass("dot-selected");
				self.$dotList.children("li").eq(index).addClass("dot-selected");
			}
			if(self.options.lazyload) {

				self.lazyLoadImg(index);
			}
			
			if(self.options.animate == "slide2dHorizontal" || self.options.animate == "slide2dVertical") {

				self.initData.pos = 0 - self.initData.offsetSize * index;
				self.animate();

			}else if(self.options.animate == "fade"){

				self.fadeAnimate(curIndex, index);

			}else if(self.options.animate == "tab"){
				self.$elm.children("li").eq(curIndex).fadeOut("fast", function(){
					self.$elm.children("li").eq(curIndex).hide();
					self.$elm.children("li").eq(index).fadeIn("fast",function() {
						self.$elm.children("li").eq(index).show();
					})
				})
				
			}
//			self.$elm.children("li").eq(index).addClass("item-selected").siblings("li").removeClass("item-selected");
			self.start();
		},

		//以step为单位翻到下一项
		next : function() {
			var self = this;
			//手动滚动时先暂停
			self.stop();

			var curIndex = self.getCurrentIndex(),
				nextIndex = (curIndex + 1) % self.num;
			
			if(self.options.lazyload) {

				self.lazyLoadImg(nextIndex);
			}	

			self.$elm.children("li").eq(curIndex).removeClass("item-selected");
			self.$elm.children("li").eq(nextIndex).addClass("item-selected");

			if(self.$dotList) {
				self.$dotList.children("li").eq(curIndex).removeClass("dot-selected");
				self.$dotList.children("li").eq(nextIndex).addClass("dot-selected");
			}
			//2d水平、垂直滚动
			if(self.options.animate == "slide2dHorizontal" || self.options.animate == "slide2dVertical") {
				self.initData.pos -= self.initData.offsetSize;

				if(Math.abs(self.initData.pos) >= self.initData.maxSize) {
					self.initData.pos = 0;
				}
				self.animate();

		  	}
		  	//淡入淡出
		  	else if(self.options.animate == "fade") {

		  		self.fadeAnimate(curIndex, nextIndex);

		  	}
		  	//3D水平滚动
		  	 else if(self.options.animate == "slide3dHorizontal") {

		  		var prevIndex = (curIndex - 1 + self.num) % self.num,
		  			nnextIndex = (nextIndex + 1) % self.num;
		  		self.galleryAnimate(nnextIndex, nextIndex, curIndex, prevIndex);
		  		
		  		var argument = [
		  			{
		  				pos : nnextIndex,
		  				animate : "smallRight"
		  			},
		  			{
		  				pos : nextIndex,
		  				animate : "bigCenter"
		  			},
		  			{
		  				pos : curIndex,
		  				animate : "smallLeft"
		  			},
		  			{
		  				pos : prevIndex,
		  				animate : "backHidden"
		  			}
		  		];
		  		self.galleryAnimate(argument);
		  	}else if(self.options.animate == "tab"){
		  		self.$elm.children("li").eq(curIndex).fadeOut("fast", function(){
					self.$elm.children("li").eq(curIndex).hide();
					self.$elm.children("li").eq(nextIndex).fadeIn("fast",function() {
						self.$elm.children("li").eq(nextIndex).show();
					})
				})
		  	}

			self.start();

		},

		//以step为单位翻到上一项
		prev : function() {
			var self = this;
			self.stop();
			var curIndex = self.getCurrentIndex(),
				nextIndex = (curIndex + self.num - 1) % self.num;

			//加载前回调
			if(self.options.lazyload) {

				self.lazyLoadImg(nextIndex);
			}

			self.$elm.children("li").eq(curIndex).removeClass("item-selected");
			self.$elm.children("li").eq(nextIndex).addClass("item-selected");

			if(self.$dotList) {
				self.$dotList.children("li").eq(curIndex).removeClass("dot-selected");
				self.$dotList.children("li").eq(nextIndex).addClass("dot-selected");
			}

			//2d水平、垂直滚动
			if(self.options.animate == "slide2dHorizontal" || self.options.animate == "slide2dVertical") {
				
				self.initData.pos += self.initData.offsetSize;

				if(self.initData.pos > 0) {

					self.initData.pos = self.initData.offsetSize - self.initData.maxSize;
				}
				self.animate();
				
			}
			//淡入淡出特效
			else if(self.options.animate == "fade") {

		  		self.fadeAnimate(curIndex, nextIndex);

		  	}
		  	//3d水平轮播
		  	 else if(self.options.animate == "slide3dHorizontal") {
		  		var prevIndex = (curIndex + 1) % self.num,
		  			nnextIndex =(nextIndex - 1 + self.num) % self.num;

		  		var argument = [
		  			{
		  				pos : nnextIndex,
		  				animate : "smallLeft"
		  			},
		  			{
		  				pos : nextIndex,
		  				animate : "bigCenter"
		  			},
		  			{
		  				pos : curIndex,
		  				animate : "smallRight"
		  			},
		  			{
		  				pos : prevIndex,
		  				animate : "backHidden"
		  			}
		  		];

		  		self.galleryAnimate(argument);
		  	}else if(self.options.animate == "tab"){

		  		self.$elm.children("li").eq(curIndex).fadeOut("fast", function() {

					self.$elm.children("li").eq(curIndex).hide();

					self.$elm.children("li").eq(nextIndex).fadeIn("fast",function() {
						self.$elm.children("li").eq(nextIndex).show();
					})
				})
		  	}
		  	self.start();
		},

		//取得当前得到焦点项在所有数据项中的索引值
		getCurrentIndex : function() {
			return this.$elm.children("li").index(this.$elm.children(".item-selected"))
		},

		//取得数据项的总数目
		getTotalCount : function(){
			return this.$elm.children().length;
		},

		//2d水平、垂直动画函数
		animate : function() {
			var self = this;

			// @vars {String}    self.direction  {left|top}               根据滚动效果决定方向
			// @vars {String}    self.size       {self.options.containerWidth|
			//									  self.options.containerHeight} 根据滚动方向决定用宽度还是高度值 																							 
			var animateData = {};
			animateData[self.initData.direction] = self.initData.pos + "px";
			self.$elm.animate(animateData, self.options.duration, self.afterRender);
		},

		//淡入淡出函数
		// @param  {Number}  curIndex  当前选中项
		// @param  {Number}  nextIndex  下一选中项
		fadeAnimate : function(curIndex, nextIndex) {
			var self = this;

			self.$elm.children("li").eq(curIndex).animate({
		  			opacity : 0
		  		},self.options.duration, self.afterRender);
		  	self.$elm.children("li").eq(nextIndex).animate({
		  		opacity :1
		  	},self.options.duration, self.afterRender);
		},

		/**
		 * @des	   3d水平轮播
		 * @param  {Array}   {
				pos : ''   //描述滚动项的索引
				animate : '' //描述滚动项的动画效果，根据statusData中的key决定
		 }
		**/
		galleryAnimate : function(argumentArray){
			var self = this;

			//定义四种图片的状态信息
			var statusData = {
				smallLeft : {
					"width" : self.options.containerWidth * 0.8,
					"height" : self.options.containerHeight * 0.8,
					"margin-top" : self.options.containerHeight * 0.1,
					"left" : 0,
					"opacity" : 0.5,
					"z-index" : 0
				},
				bigCenter : {
					"width" : self.options.containerWidth,
					"height" : self.options.containerHeight,
					"left" : (self.options.outContainerWidth - self.options.containerWidth)/2,
					"margin-top" :0,
					"opacity" : 1,
					"z-index" : 3
				},
				smallRight : {
					"width" : self.options.containerWidth * 0.8,
					"height" : self.options.containerHeight * 0.8,
					"margin-top" : self.options.containerHeight * 0.1,
					"left" : (self.options.outContainerWidth + self.options.containerWidth)/2,
					"opacity" : 0.5,
					"z-index" : 0
				},
				backHidden : {
					"width" : self.options.containerWidth * 0.8,
					"height" : self.options.containerHeight * 0.4,
					"left" : 0 - self.options.containerWidth * 0.8,
					"margin-top" : self.options.containerHeight * 0.3,
					"opacity" : 0,
					"z-index" : 0
				}
			};
			for(var i = 0, len = argumentArray.length; i < len; i++) {

				var animateData = statusData[argumentArray[i].animate];
				self.$elm.children("li").eq(argumentArray[i].pos).animate(animateData, self.options.duration);
			}
		}
	};
}(jQuery))
