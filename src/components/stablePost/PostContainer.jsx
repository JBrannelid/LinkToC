import React, { useMemo } from "react";
import PostGroup from "./PostGroup";
import {
  isToday,
  isLastWeek,
  parseISO,
  dateFnsCompareDesc,
} from "../../utils/calendarUtils";

const PostContainer = ({
  posts,
  onEditPost,
  onDeletePost,
  onTogglePin,
  onCreateComment,
  onDeleteComment,
  comments,
  commentLoading,
  fetchComments,
}) => {
  const groupedPosts = useMemo(() => {
    const groups = {
      today: [],
      lastWeek: [],
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
        } else if (isLastWeek(postDate)) {
          groups.lastWeek.push(post);
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
    groups.lastWeek.sort(sortByDate);
    groups.older.sort(sortByDate);

    return groups;
  }, [posts]);

  return (
    <div className="py-2">
      {groupedPosts.today.length > 0 && (
        <PostGroup
          title="Today"
          posts={groupedPosts.today}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onTogglePin={onTogglePin}
          onCreateComment={onCreateComment}
          onDeleteComment={onDeleteComment}
          comments={comments}
          commentLoading={commentLoading}
          fetchComments={fetchComments}
        />
      )}

      {groupedPosts.lastWeek.length > 0 && (
        <PostGroup
          title="Last week"
          posts={groupedPosts.lastWeek}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onTogglePin={onTogglePin}
          onCreateComment={onCreateComment}
          onDeleteComment={onDeleteComment}
          comments={comments}
          commentLoading={commentLoading}
          fetchComments={fetchComments}
        />
      )}

      {groupedPosts.older.length > 0 && (
        <PostGroup
          title="Older posts"
          posts={groupedPosts.older}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onTogglePin={onTogglePin}
          onCreateComment={onCreateComment}
          onDeleteComment={onDeleteComment}
          comments={comments}
          commentLoading={commentLoading}
          fetchComments={fetchComments}
        />
      )}
    </div>
  );
};

export default PostContainer;
