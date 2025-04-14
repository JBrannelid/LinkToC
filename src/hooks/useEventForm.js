import { useState, useEffect } from "react";
import { formatDateForInput } from "../utils/calendarUtils";

export const useEventForm = (event, onSubmit, onCancel) => {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    startDateTime: "",
    endDateTime: "",
  });

  // Validation state
  const [formError, setFormError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // When editing, set form with eventData
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        startDateTime: formatDateForInput(event.startDateTime),
        endDateTime: formatDateForInput(event.endDateTime),
      });
    }
  }, [event]);

  // Update form state when input values change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));

    if (formError) {
      setFormError(null);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Handle form cancellation
  const handleCancel = (event) => {
    event.preventDefault();
    if (onCancel) {
      onCancel();
    }
  };

  return {
    formData,
    formError,
    handleChange,
    handleSubmit,
    handleCancel,
    isValid,
  };
};
