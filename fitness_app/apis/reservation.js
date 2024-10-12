/**
 * 获取可预约信息
 */
export const getRsvDateApi = async (data) => {
  return uni.$u.http.post("/app/rsv/getReservationDate", data, {
    custom: {
      loading: true,
    },
  });
};

/**
 * 预约操作
 */
export const handlerRsvApi = async (data) => {
  return uni.$u.http.post("/app/rsv/handlerRsv", data, {
    custom: {
      loading: true,
      oriData: true,
    },
  });
};

/**
 * 创建预约记录
 */
export const createRsvApi = async (data) => {
  return uni.$u.http.post("/app/rsv/create", data, {
    custom: {
      loading: true,
      oriData: true,
    },
  });
};

/**
 * 创建预约记录
 */
export const listByUserApi = async (params) => {
  return uni.$u.http.get("/app/rsv/listByUser", {
    params,
    custom: {
      loading: true,
      // oriData: true,
    },
  });
};

/**
 * 修改预约
 */
export const updateRsrApi = async (data) => {
  return uni.$u.http.post("/app/rsv/updateRsr", data, {
    custom: {
      loading: true,
      // oriData: true,
    },
  });
};

/**
 * 删除预约
 */
export const delRsrApi = async (data) => {
  return uni.$u.http.post("/app/rsv/delRsr", data, {
    custom: {
      loading: true,
      // oriData: true,
    },
  });
};
