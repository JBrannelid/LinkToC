export const useLoadingState = (isLoading, loadingMessage = "Loading...") => {
  return {
    isLoading,
    loadingMessage,
  };
};
