<template>
    <div class="app">
        <router-view keep-alive></router-view>
    </div>
</template>
<style lang="less">
    @import "App.less";
</style>
<script type="text/javascript">

	import store from './vuex/store'

	import login from './mixin/login'

	import Cookies from './libs/cookie.js'

	export default {
		store,
		mixins: [login],
		created() {

			if( Cookies.get("58ua") == '58app' && (!Cookies.get("uid") || !Cookies.get("PPU"))) {
				Cookies.remove(Cookies.COOKIE_ZZU, Cookies.COOKIE_OPTION)
			}
		}
	}

</script>
