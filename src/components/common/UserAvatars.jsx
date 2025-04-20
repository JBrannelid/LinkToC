import React from "react";
import UserProfileImage from "../calendar/UserProfileImage";

const UserAvatars = ({ users, onSelectUser }) => {
  // If there are no users, don't render anything
  if (!users || users.length === 0) return null;

  // Maximum number of avatars to show before adding a +N indicator
  const MAX_VISIBLE_AVATARS = 4;
  const totalUsers = users.length;
  const hasMoreUsers = totalUsers > MAX_VISIBLE_AVATARS;

  // Show up to MAX_VISIBLE_AVATARS avatars
  // If we have more users than the max, we need to reserve a spot for the +N indicator
  const displayUsers = users.slice(
    0,
    hasMoreUsers ? MAX_VISIBLE_AVATARS - 1 : MAX_VISIBLE_AVATARS
  );
  const remainingUsersCount = totalUsers - displayUsers.length;

  // Ensure all users have valid data structure
  const validUsers = displayUsers.map((user) => {
    // Handle case where user data might be incomplete
    if (!user) return { id: 0 };

    // If there's no firstName or lastName, try to extract from email or use defaults
    if (!user.firstName && !user.lastName && user.email) {
      const emailParts = user.email.split("@")[0].split(".");
      if (emailParts.length >= 2) {
        return {
          ...user,
          firstName:
            emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1),
          lastName:
            emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1),
        };
      }
    }

    // If we still don't have names, use defaults
    return {
      ...user,
      firstName: user.firstName || "User",
      lastName: user.lastName || String(user.id),
    };
  });

  return (
    <div
      className="w-full h-full flex items-center justify-center p-1"
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectUser && users.length > 0) {
          onSelectUser(users[0].id);
        }
      }}
    >
      {/* 2×2 grid layout for avatars with smaller gap and overall size */}
      <div className="grid grid-cols-2 gap-0.5 max-w-full max-h-full">
        {validUsers.map((user, index) => (
          <div
            key={user.id || index}
            className="flex justify-center items-center"
          >
            <UserProfileImage
              user={user}
              size="mini"
              className="border border-white"
            />
          </div>
        ))}

        {/* Show +N indicator if there are more users than we're displaying */}
        {hasMoreUsers && (
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-xs font-medium text-gray-600 border border-white">
              +{remainingUsersCount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatars;
