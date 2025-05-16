import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { FormProvider, FormInput } from "../forms";
import ModalHeader from "../layout/ModalHeader";
import { useAppContext } from "../../context/AppContext";

const StablePostForm = ({
  post = null,
  onSubmit,
  onCancel,
  onDelete,
  title = "New post",
}) => {
  const { currentStable, currentUser } = useAppContext();
  const fileInputRef = useRef(null);

  const methods = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    // On edit existing post
    if (post) {
      methods.reset({
        title: post.title || "",
        content: post.content || "",
      });
    } else {
      // On create new post
      methods.reset({
        title: "",
        content: "",
      });
    }
  }, [post, methods]);

  const handleSubmit = (data) => {
    const postData = {
      ...data,
      id: post?.id,
      userIdFk: post?.userIdFk || currentUser?.id,
      stableIdFk: post?.stableIdFk || currentStable?.id,
      date: post?.date || new Date().toISOString(),
      isPinned: post?.isPinned || false,
    };

    onSubmit(postData);
  };

  const handleDelete = () => {
    if (post && post.id && typeof onDelete === "function") {
      onDelete(post.id);
      onCancel();
    } else {
      onCancel();
    }
  };

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Image upload logic
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white md:bg-black/40 shadow-md flex flex-col md:items-center md:justify-center">
      <div className="w-full h-full md:h-auto md:w-xl overflow-y-auto bg-background shadow-md rounded flex flex-col relative">
        <ModalHeader
          title={title}
          showCloseBtn={true}
          onCloseClick={onCancel}
          className="bg-primary-light"
          render="left"
        />
        {/* Main content container */}
        <div className="flex flex-col flex-1 px-4 pt-4 pb-6 md:pb-4">
          <FormProvider
            methods={methods}
            onSubmit={handleSubmit}
            footer={{ showFooter: false }}
            className="flex flex-col flex-1"
          >
            {/* Form fields */}
            <div className="bg-white rounded-t-lg border-b border-primary-light">
              {/* Title input */}
              <FormInput
                name="title"
                placeholder="Title..."
                inputClassName="h-12 border-none !rounded-b-0 font-semibold"
                validation={{
                  required: "Title is required",
                  maxLength: {
                    value: 100,
                    message: "Maximum 100 characters",
                  },
                }}
              />
            </div>
            {/* Textarea input */}
            <div className="bg-white rounded-b-lg flex-grow">
              <FormInput
                name="content"
                type="textarea"
                placeholder="Description..."
                inputClassName="border-none !rounded-t-0 h-full"
                rows={7}
                validation={{ required: "Content is required" }}
                className="h-full"
              />
            </div>

            {/* Image upload button */}
            <div className="mt-4 mb-6 flex justify-end">
              <Button
                type="secondary"
                className="w-6/10 h-8 md:w-4/10"
                onClick={triggerImageUpload}
              >
                Upload image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Action buttons */}
            <div className="w-full flex justify-center mt-auto">
              <div className="flex flex-col gap-3 w-full max-w-md">
                <Button
                  type="primary"
                  className="w-full"
                  onClick={methods.handleSubmit(handleSubmit)}
                >
                  {post ? "Update" : "Post"}
                </Button>

                {post && (
                  <Button
                    type="danger"
                    className="w-full"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default StablePostForm;
