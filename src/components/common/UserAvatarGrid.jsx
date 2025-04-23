import React from "react";
import UserProfileImage from "./UserProfileImage";

const UserAvatarGrid = ({ users, onSelectUser }) => {
  const MAX_VISIBLE_USERIMAGE = 4;
  const totalUsers = users.length;
  const exceedsMaximumUserImage = totalUsers > MAX_VISIBLE_USERIMAGE;
  const visibleCount = exceedsMaximumUserImage
    ? MAX_VISIBLE_USERIMAGE - 1
    : MAX_VISIBLE_USERIMAGE;
  const displayUsers = users.slice(0, visibleCount);
  const remainingUsersCount = totalUsers - displayUsers.length;

  return (
    <div
      className="w-full h-full flex items-center justify-center p-1"
      onClick={(e) => {
        // Prevent redender from parent elements
        e.stopPropagation();

        if (onSelectUser && users.length > 0) {
          onSelectUser(users[0].id);
        }
      }}
    >
      <div className="grid grid-cols-2 gap-0.5 max-w-full max-h-full">
        {displayUsers.map((user, index) => (
          <div key={index} className="flex justify-center items-center">
            <UserProfileImage
              user={user}
              size="mini"
              className="border border-white"
            />
          </div>
        ))}

        {exceedsMaximumUserImage && (
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

export default UserAvatarGrid;
