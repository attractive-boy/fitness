import JSONbig from "json-bigint";
import { BasicUrl } from "@/config/basic";
// 此vm参数为页面的实例，可以通过它引用vuex中的变量

// baseURL = 'https://5h73f57828.zicp.fun/'

module.exports = (vm) => {
  // 初始化请求配置
  uni.$u.http.setConfig((config) => {
    /* config 为默认全局配置*/
    // config.baseURL = '/api'; /* 根域名 */
    config.baseURL = BasicUrl;
    config.timeout = 15000;
    config.dataType = "text";
    return config;
  });

  // 请求拦截
  uni.$u.http.interceptors.request.use(
    (config) => {
      // 可使用async await 做异步操作
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
      config.data = config.data || {};
      // 根据custom参数中配置的是否需要token，添加对应的请求头
      // if (config?.custom?.auth) {
      // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
      config.header.Authorization = vm.$store.getters["userModel/accessToken"];
      // }
      if (config.custom.loading) {
        if (config.custom.loadingText) {
          uni.showLoading({
            title: config.custom.loadingText,
          });
        } else {
          uni.showLoading();
        }
      }
      return config;
    },
    (config) => {
      // 可使用async await 做异步操作
      return Promise.reject(config);
    }
  );

  // 响应拦截
  uni.$u.http.interceptors.response.use(
    (response) => {
      if (response.config.custom.loading) {
        // 演示自定义参数的作用
        uni.hideLoading();
      }
      if (response.config.custom.rawData) {
        return response;
      }

      /* 对响应成功做点什么 可使用async await 做异步操作*/
      const data = JSONbig.parse(response.rawData);
      // 自定义参数
      const custom = response.config?.custom;
      if (custom.oriData) return data;
      if (data.code !== 200) {
        if (data.code == 401 && !custom.notLogin) {
          vm.$store.dispatch("userModel/setAccessToken", null);
          vm.$store.dispatch("userModel/setUserInfo", null);
          uni.clearStorageSync();
          uni.$u.toast("登录已失效");
          setTimeout(() => {
            uni.navigateTo({
              url: "/pages/user/login",
            });
          }, 700);
          return Promise.reject(data);
        }
        // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
        if (custom.toast !== false) {
          uni.$u.toast(data.msg);
        }

        // 如果需要catch返回，则进行reject
        if (custom?.catch) {
          return Promise.reject(data);
        } else {
          // 否则返回一个pending中的promise，请求不会进入catch中
          return new Promise(() => {});
        }
      }

      return data.data === undefined ? data : data.data;
    },
    (response) => {
      uni.hideLoading();
      // 对响应错误做点什么 （statusCode !== 200）
      return Promise.reject(response);
    }
  );
};
