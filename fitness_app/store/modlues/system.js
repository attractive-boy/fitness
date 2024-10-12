import { getShopInfoApi } from "@/apis/shop.js";
const state = {
  // token
  shopInfo: {},
};

const mutations = {
  setShopInfo(state, payload) {
    state.shopInfo = payload;
  },
};

const actions = {
  /**
   * 获取用户信息
   */
  getShopInfoAsync({ commit, getters }) {
    getShopInfoApi()
      .then((res) => {
        res.banner = JSON.parse(res.banner);
        res.openingHoursArr = res.openingHours
          ? res.openingHours.split(",")
          : [];
        commit("setShopInfo", res);
      })
      .catch((e) => {
        console.error(e);
      });
  },
};
const getters = {
  shopInfo(state) {
    return state.shopInfo;
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
