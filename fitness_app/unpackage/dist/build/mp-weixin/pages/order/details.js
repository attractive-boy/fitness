(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/order/details"],{"6b65":function(e,n,r){"use strict";r.r(n);var t=r("99a8"),o=r("90ec");for(var i in o)["default"].indexOf(i)<0&&function(e){r.d(n,e,(function(){return o[e]}))}(i);r("d8b5");var a=r("828b"),u=Object(a["a"])(o["default"],t["b"],t["c"],!1,null,"3f203b41",null,!1,t["a"],void 0);n["default"]=u.exports},"90ec":function(e,n,r){"use strict";r.r(n);var t=r("ae4f"),o=r.n(t);for(var i in t)["default"].indexOf(i)<0&&function(e){r.d(n,e,(function(){return t[e]}))}(i);n["default"]=o.a},"99a8":function(e,n,r){"use strict";r.d(n,"b",(function(){return o})),r.d(n,"c",(function(){return i})),r.d(n,"a",(function(){return t}));var t={MNavbar:function(){return r.e("components/MNavbar/MNavbar").then(r.bind(null,"26d8"))},uSteps:function(){return Promise.all([r.e("common/vendor"),r.e("uni_modules/uview-ui/components/u-steps/u-steps")]).then(r.bind(null,"6a3a"))},uStepsItem:function(){return Promise.all([r.e("common/vendor"),r.e("uni_modules/uview-ui/components/u-steps-item/u-steps-item")]).then(r.bind(null,"47a6"))},uImage:function(){return Promise.all([r.e("common/vendor"),r.e("uni_modules/uview-ui/components/u-image/u-image")]).then(r.bind(null,"e41d"))}},o=function(){var e=this,n=e.$createElement,r=(e._self._c,e.$formatImg(e.orderInfo.tzProd.pic)),t=e.orderInfo.createTime?e.formatTimestamp(e.orderInfo.createTime):null,o=e.orderInfo.payTime?e.formatTimestamp(e.orderInfo.payTime):null,i=e.orderInfo.dvyTime?e.formatTimestamp(e.orderInfo.dvyTime):null,a=e.orderInfo.endTime?e.formatTimestamp(e.orderInfo.endTime):null;e.$mp.data=Object.assign({},{$root:{m0:r,m1:t,m2:o,m3:i,m4:a}})},i=[]},a7e6:function(e,n,r){},ae4f:function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var t=r("2f37"),o=r("d319"),i={data:function(){return{orderForm:{orderId:void 0},orderInfo:{status:1,tzProd:{pic:null}}}},onLoad:function(e){this.orderForm.orderId=e.orderId,this.getOrderInfo()},methods:{formatTimestamp:t.formatTimestamp,getOrderInfo:function(){var e=this;(0,o.getOrderByIdApi)(this.orderForm).then((function(n){if(n.dvyTime){var r=new Date(n.dvyTime);n.endTime=new Date(r.getTime()+60*n.tzProd.lifespan*60*1e3)}e.orderInfo=n,console.log(n)})).catch((function(e){console.error(e)}))}}};n.default=i},d828:function(e,n,r){"use strict";(function(e,n){var t=r("47a9");r("cda3");t(r("3240"));var o=t(r("6b65"));e.__webpack_require_UNI_MP_PLUGIN__=r,n(o.default)}).call(this,r("3223")["default"],r("df3c")["createPage"])},d8b5:function(e,n,r){"use strict";var t=r("a7e6"),o=r.n(t);o.a}},[["d828","common/runtime","common/vendor"]]]);