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

export default function StablePostPage() {
  const { stableId: urlStableId } = useParams();
  const { currentStable, getCurrentStableRole } = useAppContext();
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
      {/* Form overlay */}
      {isFormOpen && (
        <StablePostForm
          post={currentPost}
          onSubmit={handleSubmitPost}
          onCancel={handleCloseForm}
          onDelete={handleDeletePost}
          title={currentPost ? "Redigera inlägg" : "Nytt inlägg"}
        />
      )}

      <div className="flex-1 px-6 py-2 overflow-y-auto">
        {/* Create post button */}
        {canCreatePosts && (
          <div className="mb-1">
            <div className="flex justify-end">
              <Button
                type="primary"
                variant="icon"
                className="!text-primary"
                onClick={handleOpenCreateForm}
                aria-label="Add new post"
              >
                <AddNoteIcon className="w-9 h-9" />
              </Button>
            </div>
          </div>
        )}

        {/* Post list */}
        <PostContainer
          posts={posts}
          onEditPost={handleOpenEditForm}
          onDeletePost={handleDeletePost}
        />
      </div>
    </div>
  );
}
