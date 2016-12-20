<template>
  {{ search }}
  <div class="pay" v-if="back">
      <div class="pay-success" v-if='success'>
        您已支付成功！
        <p>
          {{ countDown }}秒后跳到支付成功页
        </p>
        <p>
          <a @click='toSuccess'>现在就去</a>
        </p>
      </div>
      <div class="pay-fail" v-else>
         尚未查到你的支付信息
         <p>
           {{ countDown }}秒后跳到确认订单页
         </p>
         <p>
           <a @click='toDelivery'>立即回去</a>
         </p>
      </div>
  </div>
</template>
<script>
import { isPaySuccess } from '../../libs/data-api'
export default {
  name: 'pay-query',
  data () {
    return {
      search: window.location.search,
      back: false,
      success: false,
      timer: null,
      countDown: 5
    }
  },
  methods: {
    toSuccess() {
      this.$router.go({
          name: 'success',
          params: {
            order_id: this.$route.query.orderId
          },
          query: {
            itemTypeList: this.$route.query.prodType
          },
          replace: true
      })
    },
    toDelivery () {
      this.$router.go({
          name: 'delivery',
          params: {
            product_id: this.$route.query.infoId
          },
          replace: true
      })
    }
  },
  route: {
    data() {
      isPaySuccess({
          orderId: this.$route.query.orderId,
          payId: this.$route.query.payId
         }).then( response => {
          this.back = true
          if(response.data.respCode == 0) {
              if(response.data.respData.success == 1) {
                this.success = true
                this.timer = setInterval(() => {
                    this.countDown -= 1;
                    if(this.countDown == 0) {
                      clearInterval(this.timer);
                      this.toSuccess();
                    }
                  }, 1000)
              } else {
                this.success = false;
                this.timer = setInterval(() => {
                    this.countDown -= 1;
                    if(this.countDown == 0) {
                      clearInterval(this.timer);
                      this.toDelivery();
                    }
                  }, 1000)
              }
          }
      })
   }
  }
}
</script>

<style lang="less">

</style>
