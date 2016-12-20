<template>
    <div class="detail-carousel" v-el:sliderwrap>
    	<div v-el:slider class="slider"
             :style="{ width : slideWidth, transform : slideLeft }"
             v-touch:tap="toBigView"
             v-touch:swipeleft="swipeLeft('slider')"
             v-touch:swiperight="swipeRight('slider')"
             v-touch-options:swipe="swipeOption"
        >
    		<div class="slider-item"  v-for="url in urls" track-by="$index">
    			<img :ref="url" :style="imgStyle[$index]"/>
                <div v-if="infos.status !=1 && infos.status !=2"  class="carousel-sold">

                </div>
    		</div>
    	</div>
      <div class="mengceng">
        <div class="carousel-view-count">{{infos.viewCount}}人浏览</div>
        <div class="carousel-progress">
            <div v-show="showStep"  class="carousel-progress-bg"></div>
            <div v-show="showStep" class="carousel-progress-step" :style="stepStyle"></div>
            <div class="carousel-progress-count">
                {{currentCount}}/{{bigUrls.length}}
            </div>
        </div>
      </div>
    </div>
    <!--轮播-->
    <div v-if="showBigView" v-touch:tap="hideBigView" class="detail-carousel-full" >
        <div class="detail-carousel-full-bg"></div>

        <div v-el:bigslider class="carousel-full-slider"
             :style="{ width : slideWidth, transform : slideLeft }"
             v-touch:swipeleft="swipeLeft('bigslider')"
             v-touch:swiperight="swipeRight('bigslider')"
             v-touch-options:swipe="swipeOption"
        >
            <div style="width:20rem" class="carousel-full-slider-item" v-for="url in bigUrls" track-by="$index">
                <img :ref="url" style="width:20rem"/>
            </div>
        </div>

        <div class="carousel-full-progress">
            <div class="carousel-full-progress-count">
                {{currentCount}}/{{bigUrls.length}}
            </div>
        </div>
    </div>
</template>
<style lang="less">
	@import "DetailCarousel.less" ;
</style>
<script>
    import Native from '../../../libs/native'
    module.exports = {
    	props : ["urls","bigUrls","currentCount","infos"],
        data : function () {
            return {
                showBigView : false,
                swipeOpiton : {
                    direction : Hammer.DIRECTION_HORIZONTAL
                },
                imgStyle:[]
            }
        },
        computed : {

            showStep:function(){
                return this.bigUrls.length > 1;
            },
            processWidth : function(){
                return (1 / ( this.bigUrls.length || 1) * 100) + '%';
            },
            slideWidth : function () {
                return (this.bigUrls.length || 1) * 20 + 'rem';
            },
            slideLeft : function () {
                var left = - (this.currentCount - 1) * 20;
                left = left < 0 ? left + 'rem' : left;
                return 'translate3d(' + left + ',0rem,0rem)';
            },
            stepLeft : function() {
                return (this.currentCount - 1) * (1 / ( this.bigUrls.length || 1) * 100) + "%";
            },
            stepStyle : function() {
                return {
                    width : this.processWidth,
                    left : this.stepLeft
                }
            }
        },
        watch:{
            'bigUrls':function(){
                this.lazyLoad('slider');
            },
            'showBigView':function(){
                if(this.showBigView){
                    this.lazyLoad('bigslider');
                }else{
                    this.lazyLoad('slider');
                }
            }
        },
        methods : {
            toBigView() {
                this.showBigView = true;
            },
            hideBigView() {
                this.showBigView = false;
            },
            gocenter(){
                Native.setWebLog({
                    actiontype : "touxiang",
                    pagetype: "zz",
                });
                this.$router.go({
                     name: 'profile',
                     params: {user_id: this.infos.uid}
                })
            },
            swipeLeft(elestr) {
                if(this.currentCount < this.bigUrls.length){
                    this.currentCount++;
                    if(this.currentCount < this.bigUrls.length){
                        this.lazyLoad(elestr);
                    }
                }
            },
            swipeRight(elestr) {
                if(this.currentCount > 1){
                    this.currentCount--;
                    if(this.currentCount > 0){
                        this.lazyLoad(elestr);
                    }
                }
            },
            lazyLoad(elestr){
                var eles = this.$els[elestr].querySelectorAll('img');
                if(!eles.length) return;
                eles[this.currentCount-1].src = eles[this.currentCount-1].getAttribute('ref');
                this.setPic(elestr,eles[this.currentCount-1],eles[this.currentCount-1].getAttribute('ref'),0.8);
                if(this.currentCount < this.bigUrls.length){
                    eles[this.currentCount].src = eles[this.currentCount].getAttribute('ref');
                    this.setPic(elestr,eles[this.currentCount],eles[this.currentCount].getAttribute('ref'),0.8);
                }

            },
            setPic(elestr,ele,src,RATIO){
                var img = new Image();
                img.src = src;
                var _this = this;
                img.addEventListener("load",function(){
                    /*var RATIO = 0.82;  */
                    var elemWidth = img.width;
                    var elemHeight = img.height;
                    var containerWidth = _this.$els.sliderwrap.clientWidth;
                    var containerHeight = containerWidth * RATIO;
                    var true_r = elemHeight / elemWidth;
                    //以容器宽为准等比压缩
                    if(elemHeight > RATIO*elemWidth){
                        if(elemHeight > containerHeight){
                            var css_text = "";
                            if(elestr == 'slider'){
                                css_text = "width: 100%;height:auto;margin-top:" + (-Math.abs(containerWidth * true_r - containerHeight) / 2) + "px";
                            }else{
                                css_text = "width: 100%;height:auto;";
                            }
                            ele.style.cssText = css_text;

                        }else{
                            ele.style.width = '100%';
                        }
                    }else{
                        if(elemWidth > containerWidth){
                            var css_text = "";
                            if(elestr == 'slider'){
                                css_text = "height:"+ containerHeight + "px;width:auto;margin-left:" + (-Math.abs(containerHeight/true_r - containerWidth) / 2) + "px";
                            }else{
                                css_text = "height:"+ containerHeight + "px;width:auto;";
                            }
                            ele.style.cssText = css_text;
                        }else{
                            ele.style.cssText = "height:"+ containerHeight + "px";
                        }
                    }
                }.bind(this));
            },
        },
        /*events : {
            initBigView : function(){
                this.showBigView = false;
            }
        },*/


    }
</script>
