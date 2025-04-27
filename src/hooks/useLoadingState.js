export const useLoadingState = (isLoading, operationType = "default") => {
  const getLoadingMessage = () => {
    switch (operationType) {
      case "fetch":
        return "Laddar hem data, vänligen vänta...";
      case "create":
        return "Skapar ny data, vänligen vänta...";
      case "update":
        return "Uppdaterar, vänligen vänta...";
      case "delete":
        return "Tar bort, vänligen vänta...";
      default:
        return "Snart är vi färdiga, vänligen vänta...";
    }
  };

  return {
    isLoading,
    operationType,
    getMessage: getLoadingMessage,
  };
};
