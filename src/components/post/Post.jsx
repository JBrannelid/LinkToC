import React, { useState } from "react";

export default function Post() {
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  return <div>Post</div>;
}
