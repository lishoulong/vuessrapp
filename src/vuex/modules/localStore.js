/**
 * Created by yunhailu on 2016/8/4.
 */

import {local as localStore} from '../../libs/store';

const state = {
    chatList: localStore.get("chatList") || {},
    systemList: localStore.get("systemList") || {}
}

const mutations = {
    SET_CHATLIST(state, chatList){
        state.chatList = chatList;
        localStore.set("chatList", chatList);
    },
    SET_SYSTEMLIST(state, systemList){
        state.systemList = systemList;
        localStore.set("systemList", systemList);
    }
}

export default {
    state,
    mutations
}

