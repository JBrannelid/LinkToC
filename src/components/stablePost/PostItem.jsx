import React, { useState } from "react";
import { getProfileImageUrl } from "../../utils/userUtils";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import PinIcon from "../../assets/icons/PinIcon";
import LoadingSpinner from "../ui/LoadingSpinner";
import { format, parseISO } from "../../utils/calendarUtils";
import Button from "../ui/Button";
import PenIcon from "../../assets/icons/PenIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import { USER_ROLES } from "../../context/AppContext";
import StablePostEditForm from "../forms/StablePostEditForm";
import ConfirmationModal from "../ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";

const PostItem = ({ post, onEditPost, onDeletePost }) => {
  const { user, isLoading } = useAuth();
  const { getCurrentStableRole } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user is admin/manager or post creator
  const currentRole = getCurrentStableRole();
  const isAdmin =
    currentRole === USER_ROLES.ADMIN || currentRole === USER_ROLES.MANAGER;
  const isPostCreator = String(user?.id) === String(post.userId);
  const canEditPost = isPostCreator || isAdmin;

  // Not implemented in current HiFi-Mockup
  const formatPostDate = (dateString) => {
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch (error) {
      return "Unknown date";
    }
  };

  // Format post time with a helper utils function
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

    // Not in use
    profileImage: post.posterProfileImage,
  };

  const userFullName =
    `${displayUser.firstName} ${displayUser.lastName}`.trim() || "Unknown User";

  const handleSaveEdit = (formData) => {
    if (onEditPost) {
      onEditPost(formData);
      setIsEditing(false);
    }
  };

  const handleDeletePost = () => {
    if (onDeletePost) {
      onDeletePost(post.id);
      setIsDeleting(false);
    }
  };

  // If component is still loading auth data
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner size="small" className="text-gray" />
        <p className="ml-2">Laddar...</p>
      </div>
    );
  }

  // Until we have solved image handeling all post is display with a default user image
  const profileImageUrl = getProfileImageUrl(displayUser.profileImage);

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
            <p className="text-sm text-grey opacity-80">
              {/* {formatPostDate(post.date)} */}
            </p>
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
              </div>

              {post.isPinned && <PinIcon className="w-6 h-6 text-primary" />}
            </div>

            <h3 className="pb-4">{post.title}</h3>
            <p>{post.content}</p>
            <p className="text-sm text-grey opacity-80 pt-5">{userFullName}</p>
            {/* Edit/Delete buttons - Display for admins and creators */}
            {canEditPost && (
              <div className="flex justify-end">
                <Button
                  type="secondary"
                  variant="icon"
                  className=" text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <PenIcon className="w-25 h-25" />
                </Button>
                <Button
                  type="danger"
                  variant="icon"
                  className=" text-error-500"
                  onClick={() => setIsDeleting(true)}
                >
                  <TrashIcon className="w-25 h-25 " />
                </Button>
              </div>
            )}
          </div>
          {/* Using ConfirmationModal component instead of custom modal */}
          <ConfirmationModal
            isOpen={isDeleting}
            onClose={() => setIsDeleting(false)}
            onConfirm={handleDeletePost}
            title="Delete Post"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            confirmButtonType="danger"
            icon={
              <HandRaisedIcon
                size={70}
                backgroundColor="bg-error-500"
                iconColor="text-white"
              />
            }
          >
            <p className="text-small">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
          </ConfirmationModal>
        </>
      )}
    </div>
  );
};

export default PostItem;
