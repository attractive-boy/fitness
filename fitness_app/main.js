import App from "./App";

// #ifndef VUE3
import Vue from "vue";
import "./uni.promisify.adaptor";
import uView from "@/uni_modules/uview-ui";
import { addHttpIfMissing } from "@/utils/utils.js";
import store from "./store/index.js";
import { BasicUrl } from "./config/basic";
Vue.use(uView);
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
  store,
});

Vue.prototype.$formatImg = (text) => {
  return addHttpIfMissing(text, BasicUrl);
};
require("./utils/request.js")(app);
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
