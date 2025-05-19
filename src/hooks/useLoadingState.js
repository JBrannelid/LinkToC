export const useLoadingState = (isLoading, operationType = "default") => {
  const getLoadingMessage = () => {
    switch (operationType) {
      case "fetch":
        return "Loading data, please wait...";
      case "create":
        return "Creating new data, please wait...";
      case "update":
        return "Updating, please wait...";
      case "delete":
        return "Deleting, please wait...";
      default:
        return "Almost done, please wait...";
    }
  };

  return {
    isLoading,
    operationType,
    getMessage: getLoadingMessage,
  };
};
