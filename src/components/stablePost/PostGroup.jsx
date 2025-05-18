import React from "react";
import PostItem from "./PostItem";

const PostGroup = ({
  title,
  posts,
  onEditPost,
  onDeletePost,
  onTogglePin,
  onCreateComment,
  onDeleteComment,
  comments,
  commentLoading,
  fetchComments,
}) => {
  if (posts.length === 0) return null;

  return (
    <>
      {/* Display Header "Today/Yesterday/Older post" */}
      <div className="flex justify-between">
        <h2 className="text-3xl">{title}</h2>
      </div>
      {/* Loop through posts and render a PostItem for each post */}
      {posts.map((post, index) => (
        <PostItem
          key={index}
          post={post}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onTogglePin={onTogglePin}
          onCreateComment={onCreateComment}
          onDeleteComment={onDeleteComment}
          comments={comments}
          commentLoading={commentLoading}
          fetchComments={fetchComments}
        />
      ))}
    </>
  );
};

export default PostGroup;
