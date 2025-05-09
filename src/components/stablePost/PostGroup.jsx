import React from "react";
import PostItem from "./PostItem";

const PostGroup = ({ title, posts, onEditPost, onDeletePost, onTogglePin }) => {
  if (posts.length === 0) return null;

  return (
    <>
      {/* Display Header "Today/Yesterday/Older post" */}
      <div className="flex justify-between">
        <h2 className="text-xl md:text-2xl">{title}</h2>
      </div>
      {/* Loop through posts and render a PostItem for each post */}
      {posts.map((post, index) => (
        <PostItem
          key={index}
          post={post}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onTogglePin={onTogglePin}
        />
      ))}
    </>
  );
};

export default PostGroup;
