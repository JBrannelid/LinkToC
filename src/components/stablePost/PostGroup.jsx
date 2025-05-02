import React from "react";
import PostItem from "./PostItem";

const PostGroup = ({ title, posts, user }) => {
  if (posts.length === 0) return null;

  return (
    <>
      {/* Display Header "Today/Yesterday/Older post" */}
      <div className="flex justify-between">
        <h2 className="text-xl">{title}</h2>
      </div>
      {/* Map through a list of post and print out postId, content and user  */}
      {posts.map((post) => (
        <PostItem key={post.id} post={post} user={user} />
      ))}
    </>
  );
};

export default PostGroup;
