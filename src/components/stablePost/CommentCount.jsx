import React from "react";

const CommentCount = ({ count, onClick }) => {
  return (
    <div
      className="flex justify-end items-center text-gray mt-2 pb-2 border-b-1 border-primary cursor-pointer hover:text-primary"
      onClick={onClick}
    >
      <span className="text-sm">{count} comments</span>
    </div>
  );
};

export default CommentCount;
