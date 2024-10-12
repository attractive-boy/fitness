/**
 * 提交意见反馈
 */
export const feedBackSubApi = async (data) => {
  return uni.$u.http.post("/app/feedback/submit", data, {
    custom: {
      loading: true,
      loadingText: "提交中",
      toast: true,
    },
  });
};
