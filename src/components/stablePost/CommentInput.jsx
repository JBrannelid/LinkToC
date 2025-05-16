import React, { useState } from "react";
import CommentIcon from "../../assets/icons/CommentIcon";
import { formatUserFullName } from "../../utils/userUtils";
import { useAppContext } from "../../context/AppContext";

const CommentInput = ({ onSubmit, postId, disabled = false }) => {
  const [comment, setComment] = useState("");
  const { currentUser } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() && onSubmit) {
      onSubmit(postId, comment);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex">
      <CommentIcon className="w-7 h-7 mr-1 text-primary" />
      <div className="flex-grow bg-light/40 rounded-full">
        <input
          type="text"
          placeholder={`Comment as ${formatUserFullName(currentUser)}...`}
          className="w-full px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={disabled}
        />
      </div>
    </form>
  );
};

export default CommentInput;
