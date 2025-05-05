import React, { useState } from "react";
import { useWallPostForm } from "../../hooks/useWallPostForm";
import Button from "../ui/Button";

const WallPostForm = ({ event, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    wallPostData,
    formError,
    handleChange,
    handleSubmit,
    handleCancel,
    isValid,
  } = useWallPostForm(
    event,
    async (formData) => {
      try {
        setIsSubmitting(true);

        const updatedData = {
          ...formData,
        };

        await onSubmit(updatedData);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    onCancel
  );

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit(event);
  };

  return (
    <div className="bg-white p-6 mb-6 rounded-lg shadow-md border-2 border-primary">
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* title input */}
          <div className="col-span-2">
            <label htmlFor="title" className="block mb-1 font-medium">
              <p>Title</p>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={wallPostData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-grey rounded focus:border-primary focus:outline-none"
            />
          </div>

          {/* body input*/}
          <div className="col-span-2">
            <label htmlFor="body" className="block mb-1 font-medium">
              <p>Body</p>
            </label>
            <textarea
              id="body"
              name="body"
              rows="4"
              value={wallPostData.body}
              onChange={handleChange}
              className="w-full p-2 border border-grey rounded focus:border-primary focus:outline-none"
            />
          </div>

          {/* Form Error Message  */}
          {formError && (
            <div className="col-span-2 text-error-500 mt-1">{formError}</div>
          )}

          {/* Form Buttons */}
          <div className="flex justify-end mt-4 space-x-3">
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Spara
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WallPostForm;
