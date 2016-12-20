/**
 *  聊天相关的功用方法
 *
 *  包括 登录、拉取联系人、刷新实时消息等接口
 *
 */

import _ from 'underscore';
import Cookies from './cookie';
import * as Api from "./data-api";
import {TERMINAL_TYPE} from "../config/env";

const user_login = () => {

    if(!Cookies.get("58ua") == '58app') {
        Cookies.set("os", "ios", Cookies.COOKIE_OPTION);
        Cookies.set("openudid", "5d882c4f42e2613c570ab7d8de4b80e14e40e993", Cookies.COOKIE_OPTION);
    }


    const uid = Cookies.getUID(),
        ostype =  !!Cookies.get('os') && Cookies.get('os').replace(/"([^"]*)"/g, "$1"),
        token = (ostype == 'ios' ? Cookies.get("openudid") : (!!Cookies.get('cimei') && Cookies.get('cimei').replace(/"([^"]*)"/g, "$1"))),
        source = TERMINAL_TYPE;
    // const uid = '40424423205904',
    //      ostype='ios',
    //      token = '967c12f596d1d276d3e2ba611526cec62491fb70',
    //      source = 21;


    const params = _.extend({
        pc_code: 'm',
        client_version: '1.0.0'
    }, {uid, ostype, token, source});

    return Api.user_login(params);
};

/**
 *  Encapsulate `getlastcontacts` interface
 *
 *  @params {Object} pagenum, pagesize
 *	@return {Promise}  chat login
 */
export const getlastcontacts = (pageObj) => {
    const uid = Cookies.getUID(),
        source = TERMINAL_TYPE;

    const params = _.extend(pageObj, {uid, source});

    return Api.getlastcontacts(params);
};

/**
 *  Encapsulate `login` interface
 *
 *	@return {Promise}  chat login
 */
export const login = () => {
    return new Promise((resolve, reject) => {
        user_login().then(resp => {
            if(resp.data && resp.data.code == 200000){
                resolve(resp);
            } else {
                reject(resp);
            }
        })
    });
}

/**
 *  Encapsulate `msg_offline` interface
 *
 *  @params {Object} start_time, start_id, msgtype
 *	@return {Promise}  msg offline
 */
export const msg_offline = (param) => {
    const uid = Cookies.getUID(),
        source = TERMINAL_TYPE;

    const params = _.extend(param, {uid, source});

    return Api.msg_offline(params);
}

/**
 *  Encapsulate `getonlinemsg` interface
 *
 *  @params {Object} touid, msgcount, starttimestamp
 *	@return {Promise}  msg offline
 */
export const getOnlineMsg = (param) => {
    const uid = Cookies.getUID(),
        source = TERMINAL_TYPE;

    const params = _.extend(param, {uid, source});

    return Api.getOnlineMsg(params);
}

/**
 *  Encapsulate `sendMsg` interface
 *
 *  @params {Object} to_uid, n, sid, msg_data
 *	@return {Promise}  send message
 */
export const sendMsg = (param) => {
    const uid = Cookies.getUID(),
        source = TERMINAL_TYPE,
        from_uid = Cookies.getUID();

    const params = _.extend(param, {uid, source, from_uid});

    return Api.sendMsg(params);
}

/**
 *  Encapsulate `userPick` interface
 *
 *
 *	@return {Promise}  send message
 */
export const userPick = () => {
    const uid = Cookies.getUID(),
        source = TERMINAL_TYPE;

    const params = _.extend({}, {uid, source});

    return Api.userPick(params);
}
