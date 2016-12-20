<template>
	<div class="detail-comment">
		<div class="detail-comment-head">
			<span class="detail-comment-head-count">留言（{{infos.commentCount}}）</span>
			<span class="detail-comment-head-go" @click="showTip">
				<img src="images/comment-pen.png" />
				<span>我要留言</span>
			</span>
		</div>
		<ul v-if="infos.commentCount>0">
		 	<li class="detail-comment-item" v-for="actComment in actComments">
		 		<img v-bind:src="actComment.portrait | noportrait | handlePic " />
		 		<p><b>{{actComment.fromNickName}} </b><span>{{processTime(actComment.time)}}</span></p>
		 		<div class="comment-detail">{{actComment.content}}</div>
		 	</li>
		</ul>
		<p class="all-comments" v-if="infos.commentCount>3" @click="downApp">查看全部留言 <span></span></p>
		<p class="no-comments" v-if="infos.commentCount==0">暂无留言，快来抢沙发~</p>
		<zz-tip :visible.sync="isShow" :tipsparam.sync="tipsparams">
		</zz-tip>
	</div>
</template>
<style lang="less">
	@import "DetailComment.less";
</style>
<script type="text/javascript">
	import Native from '../../../libs/native'
	import zzTip from '../../Common/tips/tips.vue'
	import handleImg from '../../../libs/handleImg'
	export default {
		name: 'comment',
		props : ["comments","infos"],
		data(){
			return{
				isShow: false,
				tipsparams : {
					type : "confirm",
					content : "去转转留言，卖家回复更及时~",
					leftBtn : "不去",
					rightBtn : "这就去",
					callback: this.downAppMine,
					showX : true
				}
			}
		},
		ready(){

		},
		computed : {
			len(){
				if(this.comments == {}){
					return 0;
				}else{
					return this.comments.length;
				}


			},
			actComments(){
				return (!!this.comments && this.comments.length>3)? this.comments.splice(0,3): this.comments;
			}
		},
		filters:{
			noportrait(url) {
				return !url ? "//img.58cdn.com.cn/zhuanzhuan/defaulth-head-image-bear@3x.png" : url;
			},
			handlePic: handleImg.handleSingle
		},
		methods : {
			processTime(timeStr) {

    			var time = parseInt(timeStr);

    			var gapTime = Date.now() - time;

				var result = "";

				var gapArr = [
					{
						gap : 60 * 60 * 1000,
						func : function () {
							var result = Math.floor(gapTime / 60 / 1000);

							if(result){
								result = result += "分钟前";

                                if(result < 0){
                                    result = "刚刚";
                                }
							}else{
								result = "刚刚";
							}
							return result;
						}
					},
					{
						gap : 24 * 60 * 60 * 1000,
						func : function () {
							return Math.floor(gapTime / 60 / 60 / 1000) + "小时前";
						}
					},
					{
						gap : 7 * 24 * 60 * 60 * 1000,
						func : function () {
							return Math.floor(gapTime / 24 / 60 / 60 /1000) + "天前";
						}
					},
					{
						gap : Infinity,
						func : function () {
							var pushTime = new Date(time);
							return (pushTime.getMonth() + 1) + "-" + pushTime.getDate();
						}
					}
				];

				for(var i = 0; i < gapArr.length; i++) {
					if(gapTime < gapArr[i].gap){
						result = gapArr[i].func.call();
						break;
					}
				}
				return result;
    		},
				downAppMine(){
					Native.setWebLog({
						actiontype : "zzdownload",
						pagetype: "zzdetail"
					});
					Native.callZZApp({
						urlSearch:{
							openType: 'detail',
							id: this.infos.infoId
					  },
						channelId: 752
					});
        },
    		downApp(){
					Native.setWebLog({
						actiontype : "morecomment",
						pagetype: "zz"
					});
					Native.callZZApp({urlSearch:{
						openType: 'detail',
						id: this.infos.infoId
					},channelId: 989});
        },
        showTip(){
        	this.isShow = true;
					Native.setWebLog({
						actiontype : "woyaoliuyan",
						pagetype: "zzdetail"
					});
        }

		},
		components:{
            zzTip
        }
	}

</script>
