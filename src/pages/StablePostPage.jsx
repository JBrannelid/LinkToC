import React, { useState } from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useStablePosts } from "../hooks/useStablePosts";
import PostContainer from "../components/stablePost/PostContainer";
import { useParams } from "react-router";
import Button from "../components/ui/Button";
import PlusIcon from "../assets/icons/PlusIcon";
import { USER_ROLES } from "../context/AppContext";

export default function StablePostPage() {
  const { stableId: urlStableId } = useParams();
  const { currentStable, getCurrentStableRole } = useAppContext();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });

  // Use stableId from context or url params
  const currentStableId = urlStableId || currentStable?.id;

  // Get user role for current stable
  const currentRole = getCurrentStableRole();

  // Check if user can create posts (admin or manager)
  const canCreatePosts =
    currentRole === USER_ROLES.ADMIN || currentRole === USER_ROLES.MANAGER;

  // Get post data and functions
  const {
    posts,
    status: { loading, error },
    loadingState,
    createPost,
    updatePost,
    deletePost,
  } = useStablePosts(currentStableId);

  // Handle form input changes for new post
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;

    const success = await createPost({
      userIdFk: user.id,
      stableIdFk: currentStableId,
      title: newPost.title,
      content: newPost.content,
      date: new Date().toISOString(),
      isPinned: false,
    });

    if (success) {
      setNewPost({ title: "", content: "" });
      setIsCreating(false);
    }
  };

  // Handle editing existing post
  const handleEditPost = async (postData) => {
    await updatePost(postData);
  };

  // Handle deleting post
  const handleDeletePost = async (postId) => {
    await deletePost(postId);
  };

  // Display loading spinner
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState.getMessage()}</p>
      </div>
    );
  }

  return (
    <div className="bg-background flex flex-col overflow-y-hidden pb-30">
      <div>
        <ModalHeader title="Flödet" />
      </div>
      <div className="flex-1 px-6 py-2 overflow-y-auto">
        {/* Create post form (for admins and managers) */}
        {canCreatePosts && (
          <div className="mb-6">
            {!isCreating ? (
              <Button
                type="primary"
                className="flex items-center"
                onClick={() => setIsCreating(true)}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New Post
              </Button>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="font-medium mb-3">Create New Post</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Post title"
                  />
                  <textarea
                    name="content"
                    value={newPost.content}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Post content"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="secondary"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleCreatePost}
                      disabled={!newPost.title || !newPost.content}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posts list */}
        <PostContainer
          posts={posts}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      </div>
    </div>
  );
}
