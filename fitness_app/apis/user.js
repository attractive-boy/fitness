/**
 * 微信登录
 */
export const wechartLogin = async (code) => {
	return uni.$u.http.get('/app/user/weChartLogin', {
		params: {
			code: code
		},
		custom: {
			loading: true,
			toast: true,
			loadingText: '登录中...'
		},
	})
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = async () => {
	return uni.$u.http.get('/app/user/userInfo', {
		custom: {
			loading: false,
			toast: false,
		}
	})
}

/**
 * 修改用户信息 /app/user/updateUser
 */
export const updateUserApi = async (data) => {
	return uni.$u.http.post('/app/user/updateUser',data,{
		custom: {
			loading: true,
			toast: true,
			loadingText: '修改中...'
		}
	})
}