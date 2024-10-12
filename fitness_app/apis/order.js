/**
 * 创建订单
 */
export const createOrderApi = async (data) => {
  return uni.$u.http.post("/app/order/createOrder", data, {
    custom: {
      loading: true,
      loadingText: "订单生成中...",
      toast: true,
    },
  });
};

/**
 * 获取订单列表
 */
export const getOrdersApi = async (params) => {
  return uni.$u.http.get("/app/order/getOrders", {
    params,
    custom: {
      loading: true,
      loadingText: "加载中...",
      toast: true,
    },
  });
};

/**
 * 获取订单详情
 */
export const getOrderByIdApi = async (params) => {
  return uni.$u.http.get("/app/order/getOrderById", {
    params,
    custom: {
      loading: true,
      loadingText: "加载中...",
      toast: true,
    },
  });
};

/**
 * 支付操作
 */
export const handlerPayApi = async (params) => {
  return uni.$u.http.get("/app/order/handlerPay", {
    params,
    custom: {
      loading: true,
      loadingText: "支付中...",
      toast: true,
    },
  });
};

/**
 * 退款
 */
export const refundOrderApi = async (data) => {
  return uni.$u.http.post("/app/order/refundOrder", data, {
    custom: {
      loading: true,
      loadingText: "正在退款中",
      toast: true,
    },
  });
};
