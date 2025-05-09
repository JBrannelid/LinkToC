import React, { useState } from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useStablePosts } from "../hooks/useStablePosts";
import PostContainer from "../components/stablePost/PostContainer";
import { useParams } from "react-router";
import Button from "../components/ui/Button";
import AddNoteIcon from "../assets/icons/AddNoteIcon";
import StablePostForm from "../components/forms/StablePostForm";
import { USER_ROLES } from "../context/AppContext";

export default function StablePostPage() {
  const { stableId: urlStableId } = useParams();
  const { currentStable, getCurrentStableRole, currentUser } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // Use stableId from context or url params
  const currentStableId = urlStableId || currentStable?.id;
  const currentRole = getCurrentStableRole();
  // A user can create a post as long as they have a role in active stable
  const canCreatePosts = currentRole !== undefined;

  const {
    posts,
    status: { loading, error },
    loadingState,
    createPost,
    updatePost,
    deletePost,
  } = useStablePosts(currentStableId);

  // Form control functions
  const handleOpenCreateForm = () => {
    setIsFormOpen(true);
    setCurrentPost(null);
  };

  const handleOpenEditForm = (post) => {
    setCurrentPost(post);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentPost(null);
  };

  // Handle creating/updating a post
  const handleSubmitPost = async (postData) => {
    if (currentPost) {
      await updatePost(postData);
    } else {
      await createPost(postData);
    }
    handleCloseForm();
  };

  // Handle deleting a post
  const handleDeletePost = async (postId) => {
    await deletePost(postId);
  };

  // Handle toggling pin status
  const handleTogglePin = async (post) => {
    try {
      const newPostData = {
        title: post.title || "",
        content: post.content || "",
        userIdFk: currentUser?.id,
        stableIdFk: parseInt(currentStableId),
        date: post.date || new Date().toISOString(),
        isPinned: !post.isPinned,
      };

      // Delete the old post
      await deletePost(post.id);

      // Create new post with updated pin status
      await createPost(newPostData);
    } catch (error) {
      console.error("Error toggling pin status:", error);
    }
  };

  // Display loading spinner
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 h-screen">
        <LoadingSpinner size="medium" className="text-gray mb-3" />
        <p className="text-gray-600 text-center animate-pulse">
          {loadingState.getMessage()}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col pb-10">
      <div className="border-b-1 border-light flex justify-center">
        <ModalHeader
          title="Board"
          className="max-w-6xl mx-auto flex items-center"
        />
      </div>

      {/* Main content area */}
      <div className="flex max-w-4xl mx-auto w-full">
        {/* Main posts feed */}
        <div className="flex-1 p-4 md:px-6 lg:w-2/4 mt-8">
          <div className="space-y-4">
            <PostContainer
              posts={posts}
              onEditPost={handleOpenEditForm}
              onDeletePost={handleDeletePost}
              onTogglePin={handleTogglePin}
              className="bg-white rounded-xl shadow-md"
            />
            {posts && posts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="mb-2">No posts yet</p>
                {canCreatePosts && (
                  <button
                    onClick={handleOpenCreateForm}
                    className="text-primary font-medium hover:underline"
                  >
                    Create the first post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Right sidebar - visible on md display*/}
        <div className="hidden md:flex md:flex-col md:w-1/4 p-4 space-y-5 mt-22">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-medium text-md mb-3">Stable Info</h3>
            <p className="text-sm lg:text-md mb-2">
              {currentStable?.name || "Your Stable"}
            </p>
            <p className="text-xs lg:text-sm">
              Din roll: {""}
              {currentRole === USER_ROLES.USER
                ? "Medlem"
                : currentRole === USER_ROLES.ADMIN
                ? "Admin"
                : currentRole === USER_ROLES.MANAGER
                ? "Stallägare"
                : "Medlem"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-medium text-md mb-3">Quick Stats</h3>
            <p className="text-xs lg:text-sm">
              Total posts: {posts?.length || 0}
            </p>
            <p className="text-xs lg:text-sm">
              Pinned: {posts?.filter((p) => p.isPinned).length || 0}
            </p>
          </div>
          {/* Create new post button - on medium screens */}
          {canCreatePosts && (
            <Button type="primary" onClick={handleOpenCreateForm}>
              <span className="mr-5">New post</span>
              <AddNoteIcon className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>

      {/* Create new post button - on sm screen */}
      {canCreatePosts && (
        <div className="md:hidden fixed bottom-20 right-1 z-40">
          <Button
            type="primary"
            variant="icon"
            size="medium"
            className="text-primary "
            onClick={handleOpenCreateForm}
            aria-label="Add new post"
          >
            <AddNoteIcon />
          </Button>
        </div>
      )}
      {/* Form modal */}
      {isFormOpen && (
        <StablePostForm
          post={currentPost}
          onSubmit={handleSubmitPost}
          onCancel={handleCloseForm}
          onDelete={handleDeletePost}
          title={currentPost ? "Edit Post" : "New Post"}
        />
      )}
    </div>
  );
}
