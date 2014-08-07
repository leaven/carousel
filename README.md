### Carousel
一个基于jquery实现的轮播组件
支持2d水平滚动、2d垂直滚动、淡入淡出、3d水平滚动、tab切换

####HTML组织结构
````
<div id="carouselContainer">
        <ul class="bdv-carousel-list">
                <li></li>
                ....
                <li></li>
             
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
```
	.bdv-carousel-list{
	        position:absolute;
	        left:0;
	        top:0;
	        width: 984px;
	        height:500px;
	   }

```
设定好宽高即可
#### JS调用方式
```
$("#carouselContainer").bdvCarousel({
		containerWidth : 984,
		containerHeight : 500,
		direction : "backward",
		animate : "slide2dVertical"
		//animate : "slide3dVertical"

	});
```

### Demo
[【猛戳这里】](http://liwei24.fe.baidu.com/carousel/carousel/demo/carouselDemo.html)
