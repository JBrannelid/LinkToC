import React, { useState } from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useStablePosts } from "../hooks/useStablePosts";
import PostContainer from "../components/stablePost/PostContainer";
import { useParams } from "react-router";
import Button from "../components/ui/Button";
import AddNoteIcon from "../assets/icons/AddNoteIcon";
import { useForm } from "react-hook-form";
import { FormProvider, FormInput } from "../components/forms/";

export default function StablePostPage() {
  const { stableId: urlStableId } = useParams();
  const { currentStable, getCurrentStableRole } = useAppContext();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  // useForm
  const methods = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Use stableId from context or url params
  const currentStableId = urlStableId || currentStable?.id;

  // Get user role for current stable
  const currentRole = getCurrentStableRole();

  // A user can create a post as long as they have a role in active stable
  const canCreatePosts = currentRole !== undefined;

  // Get post data with error and load handling and crud functions
  const {
    posts,
    status: { loading, error },
    loadingState,
    createPost,
    updatePost,
    deletePost,
  } = useStablePosts(currentStableId);

  // Create new post
  const handleCreatePost = methods.handleSubmit((data) => {
    if (!data.title || !data.content) return;

    createPost({
      userIdFk: user.id,
      stableIdFk: currentStableId,
      title: data.title,
      content: data.content,
      date: new Date().toISOString(),
      isPinned: false,
    }).then((success) => {
      if (success) {
        methods.reset();
        setIsCreating(false);
      }
    });
  });

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
        {/* Create post  */}
        {canCreatePosts && (
          <div className="mb-1">
            {isCreating ? (
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="font-medium mb-3">Create New Post</h3>
                <FormProvider methods={methods} onSubmit={handleCreatePost}>
                  <div className="space-y-3">
                    <FormInput
                      name="title"
                      placeholder="Post title"
                      validation={{
                        required: "Title is required",
                      }}
                    />
                    <FormInput
                      name="content"
                      type="textarea"
                      placeholder="Post content"
                      rows={4}
                      validation={{
                        required: "Content is required",
                      }}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="secondary"
                        onClick={() => setIsCreating(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="primary" htmlType="submit">
                        Post
                      </Button>
                    </div>
                  </div>
                </FormProvider>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button
                  type="primary"
                  variant="icon"
                  className="!text-primary"
                  onClick={() => setIsCreating(true)}
                  aria-label="Add new post"
                >
                  <AddNoteIcon className="w-9 h-9" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Call for a list of posts */}
        <PostContainer
          posts={posts}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      </div>
    </div>
  );
}
