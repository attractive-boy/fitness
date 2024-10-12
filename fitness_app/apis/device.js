/**
 * /app/device
 */
export const remoteCmdApi = async (data) => {
  return uni.$u.http.get("/app/device/remoteCmd", {
    custom: {
      loading: true,
      loadingText: "正在开门中...",
      toast: true,
    },
  });
};
