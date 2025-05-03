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
      {/* Loop through posts and render a PostItem for each post with id, post and auther */}
      {posts.map((post) => (
        <PostItem key={post.id} post={post} user={user} />
      ))}
    </>
  );
};

export default PostGroup;
