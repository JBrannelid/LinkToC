import React from "react";
import Post from "../posts/Post";

export default function PostFeed() {
  //Post ID
  const id = 1;

  return (
    <>
      <h1 className="text-lg font-bold">Feed</h1>
      <div>
        <Post id={id} />
      </div>
      <nav>navigation bar</nav>
    </>
  );
}
