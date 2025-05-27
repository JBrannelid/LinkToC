import React, { useState } from "react";
import CloseIcon from "../../assets/icons/CloseIcon";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";
import { useAppContext } from "../../hooks/useAppContext.js";
import { parseISO, format } from "../../utils/calendarUtils";
import { USER_ROLES } from "../../utils/userUtils";
import ProfileImage from "../common/ProfileImage";
import Button from "../ui/Button";
import ConfirmationModal from "../ui/ConfirmationModal";
import LoadingSpinner from "../ui/LoadingSpinner";

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
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      onDeleteComment(commentToDelete.id, postId);
      setShowDeleteConfirm(false);
      setCommentToDelete(null);
    }
  };

  // Only proceed with deletion if user has permission
  const handleShowDeleteConfirm = (comment) => {
    if (isAdminOrOwner || comment.userId === currentUser?.id) {
      setCommentToDelete(comment);
      setShowDeleteConfirm(true);
    }
  };

  const formatCommentDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "MM/dd-yy HH:mm");
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg max-w-9/10 md:max-w-5/10 h-7/10 flex flex-col relative">
        {/* Header with X btn */}
        <div className="py-4 border-b border-gray-100">
          <h3 className="text-2xl font-semibold text-center">Comments</h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4"
            aria-label="Close"
          >
            <CloseIcon size={30} strokeWidth={2} className="text-primary " />
          </button>
        </div>

        {/* Comments section */}
        <div className="flex-grow overflow-y-auto p-4 max-h-96">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner size="medium" />
              <p className="ml-2">Loading comments...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="relative pl-16">
                    {/* Profile image positioned absolutely */}
                    <div className="absolute left-0 top-2">
                      <ProfileImage
                        user={{
                          id: comment.userId,
                          profilePicture: comment.profilePicture,
                          firstName: comment.firstName || "",
                          lastName: comment.lastName || "",
                        }}
                        className="w-12 h-12 rounded-full object-cover border border-light"
                        alt={`${comment.firstName || "User"} ${
                          comment.lastName || ""
                        }'s avatar`}
                        size="rounded"
                      />
                    </div>
                    {/* Display date format outside main border/container */}
                    <div className="text-right">
                      <span className="text-sm text-gray">
                        {formatCommentDate(comment.commentDate)}
                      </span>
                    </div>

                    {/* Comment content with border */}
                    <div
                      className={`border border-gray rounded-lg p-4 ${
                        isAdminOrOwner || comment.userId === currentUser?.id
                          ? "hover:bg-light/30 cursor-pointer"
                          : ""
                      }`}
                      onClick={() => handleShowDeleteConfirm(comment)}
                    >
                      <div className="flex mb-2">
                        <p className="font-bold">
                          {comment.firstName} {comment.lastName}
                        </p>
                      </div>
                      <p className="text-black break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray">No comments yet</p>
              )}
            </div>
          )}
        </div>

        {/* Comment input area */}
        <div className="border-t border-light p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-grow px-4 py-3 border border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-lg px-6 py-3"
              disabled={loading || !newComment.trim()}
            >
              <span className="block md:hidden">+</span>
              <span className="hidden md:block">Comment</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        confirmButtonText="Delete"
        confirmButtonType="danger"
        cancelButtonText="Cancel"
        icon={
          <HandRaisedIcon
            size={70}
            backgroundColor="bg-error-500"
            iconColor="text-white"
          />
        }
      >
        <p>
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default CommentsModal;
