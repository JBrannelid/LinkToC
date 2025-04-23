import React, { useEffect, useState } from "react";
import { formatDateForInput } from "../utils/calendarUtils";

export const useWallPost = (event, onSubmit, onCancel) => {
  const [wallPostData, setWallPostData] = useState({
    title: "",
    body: "",
    postDateTime: "",
    editedDateTime: "",
  });

  //Validation state
  const [formError, setFormError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  //When editing set form with WallPostData
  useEffect(() => {
    if (wallPost) {
      setWallPostData({
        title: wallPost.title,
        body: wallPost.body,
        postDateTime: formatDateForInput(wallpost.postDate),
        editedDateTime: formatDateForInput(wallPost.lastEdited),
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

export default useWallPost;
