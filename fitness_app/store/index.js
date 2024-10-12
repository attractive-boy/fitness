import Vue from 'vue'
import Vuex from 'vuex'
import userModel from './modlues/user.js'
import systemModel from './modlues/system.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		userModel,
		systemModel
	}
})

export default store