import React, { useState } from "react";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useAppContext } from "../../context/AppContext";
import { formatUserFullName } from "../../utils/userUtils";
import { parseISO, format } from "../../utils/calendarUtils";
import { USER_ROLES } from "../../utils/userUtils";

const CommentsModal = ({
  isOpen,
  onClose,
  comments = [],
  postId,
  onCreateComment,
  onDeleteComment,
  loading,
}) => {
  const { currentUser, getCurrentStableRole } = useAppContext();
  const [newComment, setNewComment] = useState("");

  // Get current role to determine delete permissions
  const currentRole = getCurrentStableRole();
  const isAdminOrOwner =
    currentRole === USER_ROLES.ADMIN || currentRole === USER_ROLES.MANAGER;

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onCreateComment(postId, newComment);
      setNewComment("");
    }
  };

  const formatCommentDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "yyyy-MM-dd HH:mm");
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div className="fixed inset-0 backdrop-grayscale flex items-center justify-center z-30">
      <div className="bg-white rounded-lg w-9/10 p-4 md:p-7 shadow-lg border border-light max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl md:text-2xl">Comments</h3>
          <Button type="icon" onClick={onClose} aria-label="Close comments">
            <span className="text-2xl">&times;</span>
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto mb-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner size="medium" />
              <p className="ml-2">Loading comments...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="bg-light/20 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">
                        {comment.userName || formatUserFullName(currentUser)}
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          {formatCommentDate(
                            comment.commentDate || comment.CommentDate
                          )}
                        </span>
                        {/* Show delete button if user is admin/owner OR it's their own comment */}

                        {(isAdminOrOwner ||
                          comment.userId === currentUser?.id) && (
                          <Button
                            type="icon"
                            className="text-error-500 p-1"
                            onClick={() => {
                              if (!comment.id) {
                                console.error("Comment ID is missing!");
                                return;
                              }
                              console.log(
                                `Attempting to delete comment: ${comment.id}`
                              );
                              onDeleteComment(comment.id, postId);
                            }}
                            aria-label="Delete comment"
                          >
                            <span>&times;</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm">
                      {comment.content || comment.Content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">
                  No comments yet
                </p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex mt-2">
          <input
            type="text"
            placeholder={`Comment as ${formatUserFullName(currentUser)}...`}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-l-none"
            disabled={loading || !newComment.trim()}
          >
            Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;
