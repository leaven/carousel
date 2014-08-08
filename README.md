### Carousel
一个基于jquery实现的轮播组件
支持`2d水平滚动`、`2d垂直滚动`、`淡入淡出`、`3d水平滚动`、`tab切换`<br>
目前`3d水平滚动`实现还不完善
####HTML组织结构
``` html
<div id="carouselContainer">
        <ul class="bdv-carousel-list">
                <li class="bdv-carousel-item"></li>
                ....
                <li class="bdv-carousel-item"></li>
             
        </ul>
        <div class="bdv-carousel-control">
                <ul class="bdv-carousel-dot">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
                <a class="bdv-carousel-prev" href="javascript:void(0)"></a>
                <a class="bdv-carousel-next" href="javascript:void(0)"></a>          
        </div>
  </div>

```
其中的carousel类名不可变
#### CSS组织结构
``` css
	/*外层容器需要设置一个宽度（水平滚动）或者高度（垂直滚动）使其溢出隐藏，
	淡入淡出使用的是absoulte定位，不限制宽高*/
	
	 #carouselContainer{
	  	width:984px;
		height:500px;
		margin:0 auto;
		overflow:hidden;
		position:relative;
	   }
	/*此处属性可以不设置，通过js中的参数传递*/
	.bdv-carousel-list{
	        position:absolute;
	        left:0;
	        top:0;
	        width: 984px;
	        height:500px;
	   }
	  /*每一屏的大小*/
	 #carouselContainer .bdv-carousel-list .bdv-carousel-item{
	        float:left;
	        width:984px;
	        height:500px;
	   }
```

#### JS调用方式
``` javascript
//containerWidth 设置bdv-carousel-list的宽度
//containerHeight 设置bdv-carousel-list的高度
$("#carouselContainer").bdvCarousel({
	containerWidth : 984,
	containerHeight : 500,
	direction : "backward",
	animate : "slide2dVertical"
	//animate : "slide3dVertical"

});
```
具体`options`属性请查看源注释
#### Demo
[【猛戳这里】](http://liwei24.fe.baidu.com/carousel/carousel/demo/carouselDemo.html)
