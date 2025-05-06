import React, { useState } from "react";
import { getProfileImageUrl, formatUserFullName } from "../../utils/userUtils";
import { useAuth } from "../../context/AuthContext";
import PinIcon from "../../assets/icons/PinIcon";
import LoadingSpinner from "../ui/LoadingSpinner";
import { format, parseISO } from "../../utils/calendarUtils";
import Button from "../ui/Button";
import PenIcon from "../../assets/icons/PenIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import { USER_ROLES } from "../../context/AppContext";
import StablePostEditForm from "../forms/StablePostEditForm";

const PostItem = ({ post, onEditPost, onDeletePost }) => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user can edit this post (owner or admin)
  const canEditPost =
    user?.id === post.userIdFk ||
    (user?.stableRoles &&
      (user.stableRoles[post.stableIdFk] === USER_ROLES.ADMIN ||
        user.stableRoles[post.stableIdFk] === USER_ROLES.MANAGER));

  // Format post time for display
  const formatPostTime = (dateString) => {
    try {
      return format(parseISO(dateString), "HH:mm");
    } catch (error) {
      return "";
    }
  };

  // Create a user object from the post DTO
  const displayUser = {
    firstName: post.posterFirstName || "Unknown",
    lastName: post.posterLastName || "",
    profileImage: post.posterProfileImage,
  };

  const userFullName =
    `${displayUser.firstName} ${displayUser.lastName}`.trim() || "Unknown User";

  // Profile image with fallback
  const profileImageUrl = getProfileImageUrl(displayUser.profileImage);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner size="small" className="text-gray" />
        <p className="ml-2">Laddar...</p>
      </div>
    );
  }

  // Handle saving edited post
  const handleSaveEdit = (formData) => {
    if (onEditPost) {
      onEditPost(formData);
      setIsEditing(false);
    }
  };

  // Handle deleting post
  const handleDeletePost = () => {
    if (onDeletePost) {
      onDeletePost(post.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-background pb-2">
      {isEditing ? (
        <StablePostEditForm
          post={post}
          onSubmit={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="flex justify-between">
            <p className="text-sm text-grey opacity-80"></p>
            <p className="text-xs text-grey opacity-80">
              kl {formatPostTime(post.date)}
            </p>
          </div>
          <div className="bg-white w-full rounded-lg px-3 py-4 mb-4 shadow-lg">
            <div className="flex justify-between pb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 border-1 border-primary rounded-full overflow-hidden mr-4">
                  <img
                    src={profileImageUrl}
                    alt={`Profile image of ${userFullName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-grey">{userFullName}</span>
              </div>

              {post.isPinned && <PinIcon className="w-6 h-6 text-primary" />}
            </div>

            <h3 className="pb-4">{post.title}</h3>
            <p>{post.content}</p>

            {/* Edit/Delete buttons - only shown to post creator or admins */}
            {canEditPost && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <Button
                  type="secondary"
                  size="small"
                  className="mr-2 flex items-center"
                  onClick={() => setIsEditing(true)}
                >
                  <PenIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  type="danger"
                  size="small"
                  className="flex items-center"
                  onClick={() => setIsDeleting(true)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Delete confirmation modal */}
          {isDeleting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl mb-4">Delete Post</h3>
                <p>
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button type="secondary" onClick={() => setIsDeleting(false)}>
                    Cancel
                  </Button>
                  <Button type="danger" onClick={handleDeletePost}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostItem;
