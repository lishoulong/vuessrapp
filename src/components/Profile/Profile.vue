<template>
	<div class="profile">

		<div class="profile-info" :class="{ 'profile-info-man': userTags.gender==1, 'profile-info-woman': userTags.gender==2 }">
			<img :src="userTags.portrait | handleImg" alt="avatar" class="profile-info-avatar">
			<p class="profile-info-name">{{ userTags.nickName || userTags.nickname}}</p>
			<p class="profile-info-medal">
				<span>
					<i v-for="n in parseInt(userTags.largeScore)"></i>
				</span>
				<!--
					<span class="profile-info-medal-flower"></span>
				-->
			</p>
			<p class="profile-info-location">
				坐标 {{ userTags.residence }}
			</p>
			<p class="profile-info-time">
				加入转转 {{ userTags.days }} 天 | 成功交易 {{ userTags.tradeCount }}次
			</p>
		</div>

		<div class="profile-appraise" v-if="userTags.labels && userTags.labels.length>0">
			<h4 class="profile-appraise-title">收到的评价（{{ userTags.goodcount}}）</h4>
			<span v-for="label in userTags.labels" class="profile-appraise-tag">
				{{label.content}} {{label.count}}
			</span>
		</div>

		<div class="profile-treasure" >
			<div v-if="userTags.gender==1" class="profile-treasure-title">
				他的宝贝<span>（{{ userTags.infocount }}）</span>
			</div>
			<div v-else class="profile-treasure-title">
				她的宝贝<span>（{{ userTags.infocount }}）</span>
			</div>


			<ul v-infinite-scroll="loadMoreProduct()" infinite-scroll-disabled="loading && !noMoreData" infinite-scroll-distance="100">
				<li  v-for="product in userProducts" class="profile-treasure-item" :class="{'profile-treasure-item-sold': product.status==3}">
					<div>
						<a @click="goDetail(product)">
							<div class="img" :style="{ backgroundImage: 'url(' + handleSingle(product.pics) + ')' }">
							</div>
							<p>{{ product.title }}</p>
							<p class="location"> {{ product.cityName }}</p>
							<p class="price">
								￥<var>{{ product.nowPrice }}</var>
								<span v-if="product.oriPrice > 0" class="old">￥{{ product.oriPrice }}</span>
							</p>
							<img v-if="product.status==3" src="./img/soldout.png" class="profile-treasure-item-soldimg" alt="">
						</a>
					</div>
				</li>
			</ul>

			<div v-if="noMoreData" class="profile-treasure-nomore">
				已经是全部喽!
			</div>
		</div>

	</div>
</template>
<style lang="less">
	@import "Profile.less";
</style>
<script>

	import { queryTags, getInfosByUserId } from '../../libs/data-api'

	import handleImg from '../../libs/handleImg.js'

    import Native from '../../libs/native'

	export default {
		name: 'profile',
		data(){
			return {
				userTags: {},
				userProducts: [],
				pageNumber: 1,
				pageSize: 10,
				loading: false,
				noMoreData: false

			}
		},
		computed: {
			userId() {
				return this.$route.params.user_id;
			}
		},
		methods: {
			loadMoreProduct() {
				this.loading = true

				if( this.noMoreData ) {
					return;
				}

				getInfosByUserId({
					uidB: this.userId,
					pageNumber: this.pageNumber,
					pageSize: this.pageSize
				}).then( response => {
					if( response.data.respCode == 0 ) {
						var data = response.data.respData;
						if(data == null || data == {} || data.length < this.pageSize){
							this.noMoreData = true;
						}
						this.userProducts = this.userProducts.concat(data);
						this.pageNumber++;
						this.loading = false;
					}
				})
			},
			goDetail(product){
				Native.setWebLog({
        			actiontype : "gerenzhuyeclick",
        			pagetype: "zz"
        		});
				this.$router.go({
					name: 'detail',
					params: {product_id: product.infoId }
				})
			},
			handleSingle: handleImg.handleSingle

		},
		filters: {
			handleImg: handleImg.handleSingle
		},
		route: {
			activate(){
				Native.setTitle({title: "个人中心"});
				Native.setWebLog({
        			actiontype : "gerenzhuye",
        			pagetype: "zz",

        		});
				this.pageNumber = 1;
				this.userProducts = [];
			},
			data() {
				queryTags({
					getUid: this.userId
				}).then(response => {
					if( response.data.respCode == 0 ) {
						this.userTags = response.data.respData
					}
				});

				this.loading = true
				getInfosByUserId({
					uidB: this.userId,
					pageNumber: this.pageNumber,
					pageSize: this.pageSize
				}).then( response => {
					if( response.data.respCode == 0 ) {
						var data = response.data.respData;
						this.userProducts = this.userProducts.concat(data);
						this.pageNumber++
						this.loading = false
					}
				})
			},
			deactivate() {
				/*this.noMoreData = false
				this.pageNumber = 1
				this.loading = false*/
			}
		}
	}

</script>
