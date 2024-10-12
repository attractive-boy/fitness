import {
	getUserInfoApi
} from '@/apis/user.js'
const state = {
	// token
	accessToken: uni.getStorageSync('accessToken'),
	userInfo: uni.getStorageSync('userInfo') ,


}

const mutations = {
	setAccessToken(state, payload) {

		uni.setStorage({
			key: 'accessToken',
			data: payload
		})
		state.accessToken = payload
	},
	setUserInfo(state, payload) {
		uni.setStorage({
			key: 'userInfo',
			data: payload
		})
		state.userInfo = payload
	},
}

const actions = {
	/**
	 * 获取用户信息
	 */
	getUserInfoAsync({
		commit,
		getters
	}) {
		getUserInfoApi().then((userRes) => {
			let newData = Object.assign(getters['userInfo'], userRes)
			newData.token = getters['accessToken']
			commit('setUserInfo', newData)
		}).catch(e => {
			console.error(e)
		})
	}

}
const getters = {
	accessToken(state) {
		return state.accessToken
	},
	userInfo(state) {
		return state.userInfo
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}