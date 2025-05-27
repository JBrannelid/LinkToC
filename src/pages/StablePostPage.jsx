import React, { useState } from "react";
import { useParams } from "react-router";
import AddNoteIcon from "../assets/icons/AddNoteIcon";
import StablePostForm from "../components/forms/StablePostForm";
import ModalHeader from "../components/layout/ModalHeader";
import PostContainer from "../components/stablePost/PostContainer";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAppContext } from "../hooks/useAppContext.js";
import { useStablePosts } from "../hooks/useStablePosts";
import { USER_ROLES } from "../utils/userUtils";

export default function StablePostPage() {
  const { stableId: urlStableId } = useParams();
  const { currentStable, getCurrentStableRole, currentUser } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const currentStableId = urlStableId || currentStable?.id;
  const currentRole = getCurrentStableRole();
  const canCreatePosts = currentRole !== undefined;
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const {
    posts,
    status: { loading },
    loadingState,
    createPost,
    updatePost,
    deletePost,
    togglePinStatus,
    comments,
    commentLoading,
    fetchComments,
    createComment,
    deleteComment,
  } = useStablePosts(currentStableId, currentUser);

  // Form control functions
  const handleCommentsModalOpen = () => {
    setIsCommentsModalOpen(true);
  };

  const handleCommentsModalClose = () => {
    setIsCommentsModalOpen(false);
  };

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
      await togglePinStatus(post.id);
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
          title="Feed"
          className="max-w-6xl mx-auto flex items-center"
        />
      </div>

      {/* Main content area */}
      <div className="flex max-w-5xl mx-auto w-full">
        {/* Main posts feed */}
        <div className="flex-1 p-4 md:px-6 lg:w-2/4 mt-8 relative">
          <div className="space-y-4">
            <PostContainer
              posts={posts}
              onEditPost={handleOpenEditForm}
              onDeletePost={handleDeletePost}
              onTogglePin={handleTogglePin}
              onCreateComment={createComment}
              onDeleteComment={deleteComment}
              comments={comments}
              commentLoading={commentLoading}
              fetchComments={fetchComments}
              onCommentsModalOpen={handleCommentsModalOpen}
              onCommentsModalClose={handleCommentsModalClose}
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
        <div className="hidden md:flex md:flex-col md:w-4/10 lg:w-1/3 p-4 space-y-5 sticky top-58 self-start h-fit">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-medium text-lg mb-3">Stable Info</h3>
            <p className="text-sm lg:text-lg ">
              Stable:{" "}
              <span className="text-primary">
                {currentStable?.name || "Your Stable"}
              </span>
            </p>
            <p className="text-sm lg:text-lg ">
              Your role: {""}
              {currentRole === USER_ROLES.USER ? (
                <span className="text-primary">User</span>
              ) : currentRole === USER_ROLES.ADMIN ? (
                <span className="text-primary">Admin</span>
              ) : currentRole === USER_ROLES.MANAGER ? (
                <span className="text-primary">Owner</span>
              ) : (
                <span className="text-primary">User</span>
              )}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-4">
            <h3 className="font-medium text-md mb-3">Quick Stats</h3>
            <p className="text-sm lg:text-lg ">
              Total posts:{" "}
              <span className="text-primary">{posts?.length || 0}</span>
            </p>
            <p className="text-sm lg:text-lg ">
              Pinned:{" "}
              <span className="text-primary">
                {posts?.filter((p) => p.isPinned).length || 0}
              </span>
            </p>
          </div>
          <div className="flex justify-center">
            {/* Create new post button - on medium screens */}
            {canCreatePosts && (
              <Button
                type="primary"
                className="w-9/10"
                onClick={handleOpenCreateForm}
              >
                <span className="mr-5">New post</span>
                <AddNoteIcon className="w-8 h-8" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Create new post button - on sm screen */}
      {canCreatePosts && (
        <div className="md:hidden fixed bg-primary-light rounded-full border border-light top-33 right-6 z-20">
          <Button
            type="primary"
            variant="icon"
            size="medium"
            className="text-primary"
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
      {isCommentsModalOpen && (
        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={handleCommentsModalClose}
          comments={comments?.[currentPost?.id] || []}
          postId={currentPost?.id}
          onCreateComment={createComment}
          onDeleteComment={deleteComment}
          loading={commentLoading}
        />
      )}
    </div>
  );
}
