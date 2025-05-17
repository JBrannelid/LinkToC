import React, { useState } from "react";
import { format } from "date-fns";
import { parseISO, dateFnsCompareDesc } from "../../utils/calendarUtils";
import { useAppContext } from "../../context/AppContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import WallPostCard from "./WallPostCard";
import { useStablePosts } from "../../hooks/useStablePosts";

export default function WallPost() {
  const { currentStable } = useAppContext();
  const [expandedPost, setExpandedPost] = useState(new Set());

  // Get posts directly from StablePosts hook
  const {
    posts,
    status: { loading, error },
  } = useStablePosts(currentStable?.id);

  // Filter to get only pinned posts or display a empty array
  const pinnedPosts = posts ? posts.filter((post) => post.isPinned) : [];
  const sortedPinnedPosts = [...pinnedPosts].sort((a, b) =>
    dateFnsCompareDesc(parseISO(a.date), parseISO(b.date))
  );

  const formatData = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      return "Unknown date";
    }
  };

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

  // !pinnedPosts - Display a message
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
    <div className="px-2 md:px-0 w-full md:max-w-full">
      <h2 className="text-sm md:text-2xl 2xl:text-3xl mb-2 md:mb-3 font-medium">
        Important notes
      </h2>
      <div className="bg-white lg:h-full lg:rounded-lg shadow-lg">
        {/* Display all pinned posts */}
        {sortedPinnedPosts.map((post) => (
          <div key={post.id} className="mb-4">
            <WallPostCard
              title={post.title || "Untitled post"}
              isExpanded={expandedPost.has(post.id)}
              toggleExpand={() => toggleExpand(post.id)}
            >
              <div className="mb-2">
                <p className="font-light text-sm">{post.content}</p>
              </div>
              <div className="mt-2">
                <p className="font-light text-xs text-gray">
                  {post.date ? formatData(post.date) : "No date"}
                </p>
                {post.posterFirstName && (
                  <p className="font-light text-xs text-gray">
                    {post.posterFirstName} {post.posterLastName}
                  </p>
                )}
              </div>
            </WallPostCard>
          </div>
        ))}
      </div>
    </div>
  );
}
