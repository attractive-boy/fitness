/**
 * 获取商品
 */
export const getProdsApi = async (params) => {
  return uni.$u.http.get("/app/prod/getProds", {
    params,
    custom: {
      loading: false,
    },
  });
};

/**
 * 根据id获取商品
 */
export const getProdByIdApi = async (id) => {
  return uni.$u.http.get("/app/prod/getProdById", {
    params: { id },
    custom: {
      loading: true,
    },
  });
};
