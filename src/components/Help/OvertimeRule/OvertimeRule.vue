<template>
	<div class='main'>
		<div class='chapter pdot'>
			<p >买家拍下两小时内未付款，交易自动关闭。</p>
			<p >卖家发货后，10天内买家没有申请退款或确认收货，系统认为买家已收到货且确认无误，将自动确认收货，款项由微信打给卖家。</p>
			<p>买家申请退款，卖家未发货，3天内卖家不拒绝，默认为同意退款，款项原路退回买家账户。</p>
			<p>买家申请退款，卖家已发货，7天内卖家不拒绝，默认为同意退款，款项原路退回买家账户。</p>
			<p>买家申请退款，卖家拒绝，确认收货时间调整为3天，买家如果不再进行申请退款操作，默认买家确认收货，款项由微信打给卖家。</p>
		</div>
	</div>
</template>
<style lang="less">
	@import "OvertimeRule.less";
</style>
<script>
	export default {
		name: 'overtime-rule'
	}
</script>