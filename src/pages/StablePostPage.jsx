import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useStablePosts } from "../hooks/useStablePosts";
import PostContainer from "../components/stablePost/PostContainer";

export default function StablePostPage() {
  const { currentStable } = useAppContext();
  const { user } = useAuth();

  // Use stableId from context
  const currentStableId = currentStable?.id;

  // Fetch user data with error and load handling
  const {
    posts,
    status: { loading, error },
    loadingState,
  } = useStablePosts(currentStableId);

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
        <PostContainer posts={posts} user={user} />
      </div>
    </div>
  );
}
