import React from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { FormProvider, FormInput } from "../forms";

const StablePostEditForm = ({ post, onSubmit, onCancel }) => {
  const methods = useForm({
    defaultValues: {
      title: post.title || "",
      content: post.content || "",
    },
  });

  const handleSubmit = (data) => {
    onSubmit({
      id: post.id,
      title: data.title,
      content: data.content,
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-30">
      <div className="bg-white rounded-lg w-9/10 p-7 shadow-lg border border-light max-w-md">
        {/* Header */}
        <h3 className="text-2xl text-center mb-4">Edit Post</h3>

        <FormProvider
          methods={methods}
          onSubmit={handleSubmit}
          footer={{ showFooter: false }}
        >
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title Input */}
            <FormInput
              name="title"
              label="Title"
              labelPosition="above"
              validation={{ required: "Title is required" }}
              className="w-full"
            />

            {/* Content Input */}
            <FormInput
              name="content"
              label="Content"
              labelPosition="above"
              type="textarea"
              rows={4}
              validation={{ required: "Content is required" }}
              className="w-full"
              inputClassName="p-2 border border-primary-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />

            {/* Button Group */}
            <div className="grid grid-cols-1 justify-items-center space-y-2 mt-4">
              <Button
                type="primary"
                className="w-9/10 mb-3"
                onClick={methods.handleSubmit(handleSubmit)}
              >
                Save
              </Button>

              <Button type="secondary" className="w-9/10" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default StablePostEditForm;
