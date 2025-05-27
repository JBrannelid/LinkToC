import React, { useState, useMemo } from "react";
import WallPostCard from "./WallPostCard";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useStablePosts } from "../../hooks/useStablePosts";
import { parseISO, dateFnsCompareDesc } from "../../utils/calendarUtils";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function WallPost() {
  const { currentStable } = useAppContext();
  const [expandedPost, setExpandedPost] = useState(new Set());

  const {
    posts,
    status: { loading },
  } = useStablePosts(currentStable?.id);

  const pinnedPosts = useMemo(
    () => (posts ? posts.filter((post) => post.isPinned) : []),
    [posts]
  );
  const sortedPinnedPosts = useMemo(
    () =>
      [...pinnedPosts].sort((a, b) =>
        dateFnsCompareDesc(parseISO(a.date), parseISO(b.date))
      ),
    [pinnedPosts]
  );

  const toggleExpand = (postId) => {
    setExpandedPost((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(postId)) {
        newIds.delete(postId);
      } else {
        newIds.add(postId);
      }
      return newIds;
    });
  };

  if (loading && !pinnedPosts.length) {
    return (
      <div className="px-2 md:px-0 w-full md:max-w-[58%]">
        <h2 className="text-xl md:text-2xl mb-2 md:mb-3 font-medium">
          Important notes
        </h2>
        <div className="flex items-center justify-center p-4">
          <LoadingSpinner size="medium" className="text-gray" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (pinnedPosts.length === 0) {
    return (
      <div className="px-2 md:px-0 w-full md:max-w-full">
        <h2 className="text-xl md:text-2xl mb-2 md:mb-3 font-medium">
          Important notes
        </h2>
        <div className="bg-white rounded-lg shadow-sm md:shadow overflow-hidden border border-gray-100 md:border-gray-200">
          <div className="p-4">
            <p className="text-center text-gray-500">No pinned message</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-2 w-full md:max-w-full">
      <h2 className="text-lg ml-5 md:text-2xl 2xl:text-3xl mb-2 md:mb-3 font-medium">
        Important notes
      </h2>
      <div className="lg:bg-white lg:h-full lg:rounded-lg lg:shadow-lg">
        {sortedPinnedPosts.map((post) => (
          <div key={post.id} className="mb-4 font-semibold">
            <WallPostCard
              title={post.title || "Untitled post"}
              isExpanded={expandedPost.has(post.id)}
              toggleExpand={() => toggleExpand(post.id)}
            >
              <div className="mb-2">
                <p className="font-light text-sm">{post.content}</p>
              </div>
            </WallPostCard>
          </div>
        ))}
      </div>
    </div>
  );
}
