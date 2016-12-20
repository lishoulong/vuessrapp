<template>
	<div class="detail-recommend" v-if="recommends!=''">
		<h5 v-el:h5height>相似推荐</h5>
		<ul v-el:ulheight>
            <li  class="detail-recommend-item" @click="toDetail(recommend)" v-for="recommend in recommends">
                <div class="detail-recommend-item-pic" v-lazy:background-image="infoImg(recommend.pic)"></div>
								<div class="detail-recommend-item-distance" v-if="isTrade && recommend.distance > 0">{{recommend.distance | format}}</div>
                <div class="detail-recommend-item-title">{{recommend.title}}</div>
                <div  class="detail-recommend-item-bottom">
                    <div class="detail-recommend-item-bottom-price">
                        <span class="price">{{recommend.nowPrice}}</span><span>元</span>
                    </div>
										<div class="detail-recommend-item-bottom-district" v-if="!!recommend.city || !!recommend.area">
                        <span class="district">{{recommend.city}}</span>
												<span>|</span>
												<span>{{recommend.area}}</span>
                    </div>

                </div>
            </li>
		</ul>

	</div>
</template>
<style lang="less">
	@import "DetailRecommend.less";
</style>
<script>
    import _ from 'underscore';
	import handleImg from '../../../libs/handleImg.js'

    import Native from '../../../libs/native'

    module.exports = {
        name:　"DetailRecommend",
    	props : ["recommends","isTrade"],  // v-ref:reco-child
        data () {
           return{

           }
        },
        ready(){
        },
        filters : {
            decode(url){
                return decodeURIComponent(url);
            },
						format(numbers){
						    return numbers > 1000 ? (this.judgethedot(numbers,1000)+"km") :numbers>0?(this.judgethedot(numbers,1) + "m"):""
						}
        },
        methods : {
						judgethedot(numbers,value){
								let dividevalue = (numbers/value).toString();
								let index = dividevalue.indexOf('.') || -1;
								return (index > -1 && dividevalue.split('.')[1].length > 1) ? dividevalue.slice(0,index+2) : dividevalue
						},
            setPicMake(url, width, height) {
                    let _url = '';
                    if (url.indexOf('https://wx.qlogo.cn') > -1 || url.indexOf('//wx.qlogo.cn') > -1) {
                        _index = url.lastIndexOf('/');
                        _url = url.substr(0, url.lastIndexOf('/')) + '/96';
                        return _url;
                    } else {
                        if (url.indexOf('https') > -1) {
                            _url = url;
                        } else {
                            let random = Math.ceil(Math.random() * 8);
                            _url = "https://pic" + random + ".58cdn.com.cn/zhuanzh/" + url;
                        }
                        let dotIndex = _url.lastIndexOf('.');
                        let suffix = _url.substr(dotIndex, _url.length - 1);
                        let prefix = _url.split(suffix)[0];
                        return prefix + '_' + width + '_' + height + suffix;
                    }
            },
            setPicAjust(picUrl, width, height){
                if (!picUrl) {
                        return false;
                    }
                if (picUrl instanceof Array) {
                    let newPicArr = [];
                    picUrl.map(function(item, index) {
                        newPicArr.push(this.setPicMake(item, width, height));
                    });
                    return newPicArr;
                } else if (typeof picUrl == 'string') {
                    return this.setPicMake(picUrl, width, height);
                }
            },
            infoImg(url){
				return handleImg.handleSingle(url, 210, 210);
                //return this.setPicAjust(url,210,280);
            },
            toDetail(recommend) {
                Native.setWebLog({
                    actiontype : "tuijian",
                    pagetype: "zz",
                });
								Native.setWebLog({
									actiontype: "click",
									pagetype: "listDetailGoods",
									params:[recommend.metric,"ZHUANZHUAN"]
								});
                let url = decodeURIComponent(recommend.infoUrl);
                let ypReg = /^(https\:\/\/|\/\/)youpin\.m\.58\.com/;
                if(ypReg.test(url)) {

                    window.location.href = url;

                }else{
                    this.$router.go({
                        name: 'detail',
                        params: {
                            product_id: recommend.infoId
                        },
												query: {
													  metric: recommend.metric
												}
                    })
                }

            }

        }
    }
</script>
