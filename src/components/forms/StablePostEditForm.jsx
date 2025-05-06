import React, { useState } from "react";
import Button from "../ui/Button";

const StablePostEditForm = ({ post, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: post.id,
    title: post.title || "",
    content: post.content || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="font-medium mb-3">Edit Post</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="4"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StablePostEditForm;
