/**
 * 上传单个文件
 */
export const uploadFileApi = (url) => {
	return uni.$u.http.upload('/common/upload', {
		name: 'file',
		filePath: url,
		custom: {
			loading: false,
			toast: false,
		},
	})
}