<template>
  <div>
    <zz-tip :visible="isShow" :tipsparam="cancelTipParam" slide="top" v-on:change="updateValue($event.target.value)">
        <div class="cancel">
            <ul>
                <li v-for="reason in cancelReasons" @click="cancelOrder(reason)">
                    {{ reason }}
                </li>
            </ul>
            <div @click="hideCancel" class="cancel-quit">
                取消
            </div>
        </div>
    </zz-tip>

    <zz-tip :visible="showLoading" :tipsparam="loadingTipParam"></zz-tip>
  </div>
</template>
<style lang="less">
    @import "CancelOrder.less";
</style>
<script type="text/ecmascript-6">
    import zzTip from '../tips/tips.vue';
    import * as Api from "../../../libs/data-api";

    export default{
        props: ["isShow", "orderId", "callback"],
        data(){
            return{
                showCancelTip: false,
                cancelTipParam: { type:'slide' },
                cancelReasons: ["订单信息有误", "与卖家价格未协商一致", "不想买了", "其他原因"],
                showLoading: false,
                loadingTipParam: {  type:'loading' }
            }
        },
        components:{
            zzTip
        },
        methods: {
            cancelOrder(reason){
                //console.log(reason);
                this.hideCancel();
                this.showLoading = true;
                Api.cancelOrder({
                    orderId: this.orderId,
                    cancelReason: reason
                }).then( response => {
                    this.showLoading = false;
                    this.callback(response);
                })
            },
            hideCancel(){
                //console.log("cancel");
                this.isShow = false;
            }
        }
    }
</script>
