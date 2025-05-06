import React from "react";
import PostGroup from "./PostGroup";
import {
  isToday,
  isYesterday,
  parseISO,
  dateFnsCompareDesc,
} from "../../utils/calendarUtils";

const PostContainer = ({ posts, onEditPost, onDeletePost }) => {
  const groupPostsByDate = () => {
    const groups = {
      today: [],
      yesterday: [],
      older: [],
    };

    if (posts.length === 0) {
      return groups;
    }

    // Use date-fns helpers to determine the correct group (today, yesterday, older)
    posts.forEach((post) => {
      try {
        const postDate = parseISO(post.date);

        if (isToday(postDate)) {
          groups.today.push(post);
        } else if (isYesterday(postDate)) {
          groups.yesterday.push(post);
        } else {
          groups.older.push(post);
        }
      } catch (error) {
        console.error("Error processing post date:", error);
        groups.older.push(post);
      }
    });

    // Sort each group of posts in descending order by date
    const sortByDate = (a, b) =>
      dateFnsCompareDesc(parseISO(a.date), parseISO(b.date));
    groups.today.sort(sortByDate);
    groups.yesterday.sort(sortByDate);
    groups.older.sort(sortByDate);

    return groups;
  };

  // Group posts into 'today', 'yesterday', and 'older' categories
  const groupedPosts = groupPostsByDate();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">There are no posts available</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {groupedPosts.today.length > 0 && (
        <PostGroup
          title="Today"
          posts={groupedPosts.today}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
        />
      )}

      {groupedPosts.yesterday.length > 0 && (
        <PostGroup
          title="Yesterday"
          posts={groupedPosts.yesterday}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
        />
      )}

      {groupedPosts.older.length > 0 && (
        <PostGroup
          title="Older posts"
          posts={groupedPosts.older}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
        />
      )}
    </div>
  );
};

export default PostContainer;
