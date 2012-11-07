(function($,d){$.fn.moveUnslider=function(pos,speed,easing,callback){return this.is(":animated")||this.stop().animate({left:parseFloat(pos)},speed,easing,callback);};$.fn.unslider=function(options){var o=$.extend({activeClass:"active",arrows:true,autoplay:false,speed:500,delay:3000,easing:"swing",afterSlide:function(){}},options),c="cloned",a="unslider-arrows";return this.each(function(){var me=$(this).addClass("unslider"),list=me.children("ul"),items=list.children("li"),first=items.first(),itemCount=items.length+2,width=me.width(),height=first.height(),setActive=function(el){el.addClass(o.activeClass).siblings().removeClass(o.activeClass);};if(itemCount>=4){first.addClass(o.activeClass).clone().attr("class",c).appendTo(list);items.last().clone().addClass(c).prependTo(list);list.css({width:width*itemCount,left:-width});if(o.arrows){$('<p class="'+a+'"><span class="arrow previous" /><span class="arrow next" /></p>').appendTo(me.parent()).find(".arrow").each(function(){var me=$(this),dir=me.attr("class").split(" ")[1],arrows={previous:"&larr;",next:"&rarr;"};me.attr("title","Click to show the "+dir+" slide").html(arrows[dir]);}).click(function(){var me=$(this),dir=me.attr("class").split(" ")[1],current=items.filter("."+o.activeClass),margin=parseFloat(list.css("left")),actions={previous:function(){var first=current.prev().hasClass(c),prev=first?items.eq(-1):current.prev();setActive(prev);return list.moveUnslider(margin+width,o.speed,o.easing,function(){if(parseFloat(list.css("left"))>=0){list.css("left",-(width*(itemCount-2)));margin=parseFloat(list.css("left"));}if($.isFunction(o.afterSlide)){o.afterSlide.call(this);}});},next:function(){var last=current.next().hasClass(c),next=last?items.eq(0):current.next();setActive(next);return list.moveUnslider(margin-width,o.speed,o.easing,function(){last&&list.css("left",-width);if($.isFunction(o.afterSlide)){o.afterSlide.call(this);}});}};if(actions[dir]){actions[dir]();}});$(d).keyup(function(e){var keys={37:"previous",39:"next"};if(keys[e.which]){$("."+a+" ."+keys[e.which]).click();}});}if(o.autoplay){var cont=function(){$("."+a+" .next").click();},auto=setInterval(cont,o.delay);me.hover(function(){clearInterval(auto);},function(){auto=setInterval(cont,o.delay);});}}});};})(jQuery,document);