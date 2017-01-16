<template>
	<div class="help">
		<div class="help-wrap">
			<div class="help-entrance" v-show="!typeStatus">
			<ul class="zhuan-trade">
				<li @click="clickFirst(1)">转转担保交易 <i></i></li>
			</ul>
			<ul class="process-list">
				<li @click="clickFirst(2)">信息发布规则 <i></i></li>
				<li @click="clickFirst(3)">交易流程 <i></i></li>
				<li @click="clickFirst(4)">超时规定 <i></i></li>
				<li @click="clickFirst(5)">争议仲裁 <i></i></li>
				<li @click="clickFirst(6)">转转平台管理规范 <i></i></li>
				<li @click="clickFirst(7)">转转用户行为规范 <i></i></li>
			</ul>
			<ul class="normal-problerm">
				<li @click="clickFirst(8)">常见问题 <i></i></li>
				<li @click="clickFirst(9)">常见交易欺诈 <i></i></li>
			</ul>
		</div>
		<assurance v-show="typeStatus==1"></assurance>
		<release v-show="typeStatus==2"></release>
		<tradepro v-show="typeStatus==3"></tradepro>
		<overtime v-show="typeStatus==4"></overtime>
		<dispute v-show="typeStatus==5"></dispute>
		<manage v-show="typeStatus==6"></manage>
		<behave v-show="typeStatus==7"></behave>
		<question v-show="typeStatus==8"></question>
		<cheat v-show="typeStatus==9"></cheat>
		</div>

	</div>
</template>
<style lang="less">
	@import "Help.less";
</style>
<script>
	import Assurance from './AssuranceTrade/AssuranceTrade.vue'
	import Release from './ReleaseRule/ReleaseRule.vue'
	import Tradepro from './TradeProgress/TradeProgress.vue'
	import Overtime from './OvertimeRule/OvertimeRule.vue'
	import Dispute from './DisputeArbitration/DisputeArbitration.vue'
	import Manage from './Management/Management.vue'
	import Behave from './Behaviour/Behaviour.vue'
	import 	Question from './Question/Question.vue'
	import Cheat from './CommonCheat/CommonCheat.vue'
	import Native from '../../libs/native'
	export default {
		name: 'help',
		data(){
			return{
				// typeStatus: 0
			}
		},
		computed: {
			typeStatus(){
				if(this.$route.params.type){
					return this.$route.params.type;
				}else{
					return false;
				}
			}
		},
		methods: {
			clickFirst(index){
				this.$router.push({name:'helper',params:{type:index}})
			}
		},
		components:{
			assurance: Assurance,
			release: Release,
			tradepro: Tradepro,
			overtime: Overtime,
			dispute: Dispute,
			manage: Manage,
			behave: Behave,
			question: Question,
			cheat: Cheat

		},
		route: {
			beforeRouteEnter(){
				Native.setTitle({ title: "帮助中心" });
			}
		}

	}

</script>
