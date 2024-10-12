/**
 * 获取默认店铺信息
 */
export const getShopInfoApi = async () => {
	return uni.$u.http.get('/app/shop/info', {
		custom: {
			loading: false,
		},
	})
}