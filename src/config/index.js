
import flexible from './flexible'
import plugin from './plugin'
import Cookies from './../libs/cookie'

export default function () {
	Cookies.set(Cookies.COOKIE_T, Cookies.COOKIE_T_VALUE, Cookies.COOKIE_OPTION);
	Cookies.set(Cookies.COOKIE_TK, Cookies.get('id58'), Cookies.COOKIE_OPTION);
	flexible();
	plugin.init();
}
