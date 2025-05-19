import { useEffect, useState } from "react";
import { formatDateForInput } from "../utils/calendarUtils";
import { useAppContext } from "../context/AppContext";

export const useWallPostForm = (event, onSubmit, onCancel) => {
  const { currentStable } = useAppContext();
  const [wallPostData, setWallPostData] = useState({
    title: "",
    body: "",
    postDateTime: "",
    stableIdFk: "",
    
  });

  //Validation state
  const [formError, setFormError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  //When editing set form with WallPostData
  useEffect(() => {
    if (event) {
      setWallPostData({
        title: event.title,
        body: event.body,
        postDateTime: formatDateForInput(event.postDate),
        stableIdFk: currentStable.id,
      });
    }
  }, [event]);

  //update form state when input values change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setWallPostData((wallPostData) => ({
      ...wallPostData,
      [name]: value,
    }));

    if (formError) {
      setFormError(null);
    }
  };

  //Handle submit of the form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(wallPostData);
    }
  };

  //Handle form cancellation
  const handleCancel = (event) => {
    event.preventDefault();
    if (onCancel) {
      onCancel();
    }
  };

  return {
    wallPostData,
    formError,
    handleChange,
    handleSubmit,
    handleCancel,
    isValid,
  };
};

export default useWallPostForm;
