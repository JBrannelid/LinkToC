import React from "react";
import { getProfileImageUrl } from "../../utils/userUtils";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import PinIcon from "../../assets/icons/PinIcon";
import LoadingSpinner from "../ui/LoadingSpinner";
import { format, parseISO } from "../../utils/calendarUtils";
import Button from "../ui/Button";
import PenIcon from "../../assets/icons/PenIcon";
import { USER_ROLES } from "../../context/AppContext";
import CommentIcon from "../../assets/icons/CommentIcon";

const PostItem = ({ post, onEditPost, onDeletePost, onTogglePin }) => {
  const { user, isLoading } = useAuth();
  const { getCurrentStableRole } = useAppContext();

  // Check if user is admin or post creator
  const currentRole = getCurrentStableRole();
  const isAdmin =
    currentRole === USER_ROLES.ADMIN || currentRole === USER_ROLES.MANAGER;
  const isPostCreator = String(user?.id) === String(post.userId);

  // Post access controllers
  const canEditPost = isPostCreator || isAdmin;
  const canPinPost = isAdmin;

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

  const handleTogglePin = () => {
    if (onTogglePin) {
      onTogglePin(post);
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

  // Until we have solved image handling all post is display with a default user image
  const profileImageUrl = getProfileImageUrl(displayUser.profileImage);

  // Comment count - placeholder for now
  const commentCount = post.commentCount || 0;

  return (
    <div className="bg-background pb-2 md:w-9/10 lg:mb-6">
      {/* Mobile/medium layout */}
      <div className="lg:hidden">
        <div className="flex justify-between">
          <p className="text-sm text-grey opacity-80 md:text-sm">
            {/* {formatPostDate(post.date)} */}
          </p>
          <p className="text-xs text-grey opacity-80 md:text-sm">
            kl {formatPostTime(post.date)}
          </p>
        </div>
        {/* Post content */}
        <div className="bg-white w-full rounded-lg px-6 py-2 pt-3 mb-2 shadow-lg md:hidden">
          <div className="flex justify-between pb-4">
            <div className="w-10 h-10 md:w-13 md:h-13 lg:w-17 lg:h-17 border-1 border-primary rounded-full overflow-hidden">
              <img
                src={profileImageUrl}
                alt={`Profile image of ${userFullName}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Pin icon */}
            {canPinPost && (
              <div onClick={handleTogglePin} className="cursor-pointer">
                <PinIcon
                  className={`w-6 h-6 ${
                    // Opacity for not pinned icons
                    post.isPinned ? "text-primary" : "text-primary opacity-20"
                  }`}
                />
              </div>
            )}
            {!canPinPost && post.isPinned && (
              <PinIcon className="w-6 h-6 text-primary" />
            )}
          </div>
          <h3 className="pb-4">{post.title}</h3>
          <p className="max-w-9/10">{post.content}</p>
          <p className="text-sm text-grey opacity-80 pt-5">{userFullName}</p>
          {/* Edit button - Display for admins and creators */}
          {canEditPost && (
            <div className="flex justify-end">
              <Button
                type="secondary"
                variant="icon"
                className="text-primary"
                onClick={() => onEditPost(post)}
              >
                <PenIcon className="w-25 h-25" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* md screen layout and above */}
      <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-4 pb-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 border border-primary rounded-full overflow-hidden">
              <img
                src={profileImageUrl}
                alt={`Profile image of ${userFullName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="font-medium">{userFullName}</p>
              <p className="text-xs text-gray-500">
                {formatPostDate(post.date)} - <br></br>kl{" "}
                {formatPostTime(post.date)}
              </p>
            </div>
          </div>

          {/* Pin/crud-controls */}
          <div className="flex items-center">
            {/* Edit button */}
            {canEditPost && (
              <div className="flex">
                <Button
                  type="secondary"
                  variant="icon"
                  className="text-primary"
                  onClick={() => onEditPost(post)}
                >
                  <PenIcon className="w-6 h-6" />
                </Button>
              </div>
            )}
            {canPinPost && (
              <div onClick={handleTogglePin} className="cursor-pointer ml-2">
                <PinIcon
                  className={`w-6 h-6 ${
                    post.isPinned ? "text-primary" : "text-primary opacity-20"
                  }`}
                />
              </div>
            )}
            {!canPinPost && post.isPinned && (
              <PinIcon className="w-6 h-6 text-primary ml-2" />
            )}
          </div>
        </div>

        {/* Post content */}
        <div className="px-6 pb-4">
          <h3 className="md:text-lg lg:xl mb-3">{post.title}</h3>
          <p className="mb-4">{post.content}</p>

          {post.image && (
            <div className="w-full mb-4">
              <img
                src={post.image}
                alt="Post attachment"
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Comment count - Hardcoded */}
          <div className="flex justify-end items-center text-gray mt-2 pb-2 border-b-1 border-primary">
            <span className="text-sm">{commentCount} comments</span>
          </div>

          {/* Comment form placeholder - Hardcoded */}
          <div className="mt-3 flex ">
            <CommentIcon className="w-7 h-7 mr-1 text-primary " />
            <div className="flex-grow bg-light/40 rounded-full">
              <input
                type="text"
                placeholder={`Comment as ${displayUser.firstName} `}
                className="w-full px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
