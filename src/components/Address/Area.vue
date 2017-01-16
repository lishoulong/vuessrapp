<template>
    <div class="area">
       <div class="area-item" v-for="area in areas" @click="chooseArea(area)">
       		{{ area.localName }}
       </div>
    </div>
</template>
<style lang="less">
    @import "Area.less";
</style>
<script>

import { selectArea, changeDefaultAddrCityArea } from '../../vuex/actions'

import { selectedAddr } from '../../vuex/getters'

export default {
	data(){
		return {
			areas:[]
		}
	},
	created() {
	},
	vuex: {
		actions: {
			selectArea,
			changeDefaultAddrCityArea
		},
		getters: {
			selectedAddr
		}
	},
	computed: {
		cityId() {
			return this.$route.params.city_id;
		},
		selectedInfo() {
			return this.selectedAddr.city.localName + " " + this.selectedAddr.area.localName
		}
	},
	methods: {
		chooseArea(area){

			this.selectArea(area);
			this.changeDefaultAddrCityArea(this.selectedInfo);
			window.history.go(-2);

		}
	},
	route: {
		data() {
			this.$http.jsonp('getDispLocalByParentId',{
				params: {localId: this.cityId}
			}).then(resonpse => {
				if(resonpse.data.respCode == 0) {
					this.areas = resonpse.data.respData;
				}
			})
		},
		beforeRouteEnter() {
		    document.body.style.backgroundColor = "#eeeeee";
		},
		beforeDestroy() {
		    document.body.style.backgroundColor = "";
		}
	}
}

</script>
