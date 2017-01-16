<template>
	<div class="login">
		<div class="login-title">
			<img src="//img.58cdn.com.cn/zhuanzhuan/zz/trade/img/zzlogo.png" alt="zhuanzhuan">
			<p>
				真实个人的闲置交易平台
			</p>
		</div>
		<div class="login-form">
			<div class="login-form-center">
				<div class="login-form-row">
					<i class="phone"></i>
					<input @input="inputMobile" type="text" :disabled="genterPic" v-model="mobile" placeholder="请输入手机号">
					<button  @click="sendRequestCode" class="send" :class="{active: mobileVerified,isActive: activited}" type="button">
						{{btnContent}}
					</button>
				</div>
				<div class="login-form-row" >
					<i class="lock"></i>
					<input @input="inputCode" type="text" v-model.number="code" placeholder="请输入短信验证码" >
				</div>
			</div>
		</div>
		<div class="login-submit">
			<button :class="{active: codeVerified}" @click="loginMobile" type="button">验证并登录</button>
		</div>
	</div>
</template>
<style lang="less">
	@import 'Login.less';
</style>
<script>

	import { requestCode, loginSms, login58Id } from './auth'

	import Cookies from '../../libs/cookie'

  import {local as localStore} from '../../libs/store'

	import { redirect } from '../../vuex/getters'

	const isMob = /^((\+?86)|(\(\+86\)))?(17[012356789][0-9]{8}|13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/

	const isCode = /^\d{4}$/

	import Native from '../../libs/native.js'

	import * as Util from '../../libs/util.js'

	export default {

		vuex: {
			getters: {
				redirect
			}
		},

		data () {
			return {
				mobile: '',
				code: '',
				time: 60,
				timer: null,
				mobileVerified: false,
				codeVerified: false,
				btnContent: '发送验证码',
				activeted: true,
				genterPic: false
			}
		},
		computed:{

		},
		methods: {
			inputMobile() {
				this.mobileVerified = isMob.test(this.mobile);
			},
			inputCode() {
				this.codeVerified = isCode.test(this.code)
			},
			sixtySecond(){

					let count = 60;
					this.btnContent = count + "秒后重发";
					this.activeted = false;
					this.timer = setInterval(()=>{

						count--;
						this.btnContent = count + "秒后重发";
						if(count==0){
							clearInterval(this.timer);
						 	this.activeted = true;
						 	this.timeClose = false;
						 	this.mobileVerified=true;
							this.btnContent = "重新发送验证码";
						}
					}, 1000);
			},
			sendRequestCode() {
				if(this.mobileVerified&&this.activeted){
					this.mobileVerified=false;
					this.timeClose = true;
					this.genterPic = true;
					this.sixtySecond();
					requestCode(this.mobile);
				}
			},
			loginBy58Id() {

				var ppu = Util.adapterCookie( Cookies.get('PPU') ),		// PPU
					wubaid = Util.adapterCookie( Cookies.get('uid') ) || Util.adapterCookie(Util.getUidByPPU(Cookies.get('PPU'))),   // uid
				    data = {
				        wubaid : wubaid,
				        ppu : ppu,
								mobile: this.mobile
				    };

				login58Id(data).then( response => {
					var code = response.data.respCode,
						data = response.data.respData;
					if(0 == code){
						Cookies.set(Cookies.COOKIE_ZZU, data.ppu, Cookies.COOKIE_OPTION);
						Cookies.set(Cookies.COOKIE_UID, data.uid, Cookies.COOKIE_OPTION);
						Cookies.set("zz_mobile", data.mobile, Cookies.COOKIE_OPTION);
            localStore.set("PPU", Cookies.get("PPU"));
						Native.setWebLog({
							actiontype: "mobilebindsuc",
			        pagetype: "zzlogin",
						})

						Cookies.remove('zz_mobile_bind', Cookies.COOKIE_OPTION);

						alert('登录成功')



						this.$router.push({
							name: this.redirect.name,
							params:this.redirect.params,
							replace: true
						})

					}
					else if (-2 == code){
						// -2:微信查不到用户，需要手机号
						Cookies.set('zz_mobile_bind',1);

						Native.setWebLog({
							actiontype: "mobilebindfail1",
			        pagetype: "zzlogin",
						})
						//this.bindMobile();
					}
					else if (1 == code){
						// 1:手机号已绑定至其他微信
						Native.toast("手机号已绑定至其他微信!");
						Native.setWebLog({
							actiontype: "mobilebindfail2",
			        pagetype: "zzlogin",
						})
					}
					else if (-1 == code){
						Native.toast("登录失败!");
						Native.setWebLog({
							actiontype: "mobilebindfail3",
			        pagetype: "zzlogin",
						})
					}
				})
			},
			loginBySms() {
				loginSms(this.mobile, this.code).then(response => {

					let data = response.data

					if(data.respCode == 0  && data.respData){

              Cookies.set('zz_mobile', data.respData.mobile,Cookies.COOKIE_OPTION);
              Cookies.set(Cookies.COOKIE_ZZU, data.respData.ppu,Cookies.COOKIE_OPTION);
              Cookies.set(Cookies.COOKIE_UID, data.respData.uid,Cookies.COOKIE_OPTION);
							localStore.set("PPU", Cookies.get("PPU"));
							Native.setWebLog({
								actiontype: "mobileloginsuc",
								pagetype: "zzlogin",
							})

              alert('登录成功')

              this.$router.push({
              	name: this.redirect.name,
              	params:this.redirect.params,
              	replace: true
              })
          }else{
							Native.setWebLog({
								actiontype: "mobileloginfail",
								pagetype: "zzlogin",
							})
              alert('验证码错误!')
          }
				})
			},
			loginMobile() {
				if(!!Cookies.get('zz_mobile_bind')) {
					this.loginBy58Id()
				}else{
					this.loginBySms()
				}
			},
			setHeader(){
				Native.setTitle({ title: "登录" });
				Native.extendRightBtn("top_right", "帮助中心", "openHelpCenter");
				window.openHelpCenter = () => {
					return this.$router.push({
						name: 'help'
					});
				};
			}
		},
		route: {
			data(){
				this.setHeader();
			},
			beforeRouteEnter() {
				Native.setWebLog({
						actiontype: "mobileLogin",
						pagetype: "zzlogin",
					})
			},
			beforeDestroy: function (transition) {
				Native.extendRightBtn("top_right", " ", "righthelpCallback");
				window.righthelpCallback = () => { };
				transition.next();
			}
		}
	}
</script>
