import React from "react";
import ProfileImage from "./ProfileImage";

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
      className="w-full h-full flex items-start justify-start p-1"
      onClick={(e) => {
        // Prevent render from parent elements
        e.stopPropagation();

        if (onSelectUser && users.length > 0) {
          onSelectUser(users[0].id);
        }
      }}
    >
      <div className="flex flex-wrap gap-0.5 justify-evenly sm:gap-1 sm:justify-start lg:pl-2">
        {displayUsers.map((user, index) => (
          <div
            key={index}
            className="border border-background md:h-4.2 md:w-4.2 lg:h-4 lg:w-4 xl:h-5 xl:w-5"
          >
            <ProfileImage user={user} size="small" className="h-full w-full" />
          </div>
        ))}

        {exceedsMaximumUserImage && (
          <div className="flex items-center justify-center bg-gray-300 rounded-full border border-background md:h-4.2 md:w-4.2 lg:h-4 lg:w-4 xl:h-5 xl:w-5">
            <span className="text-mini lg:text-[8px] font-normal text-white">
              +{remainingUsersCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatarGrid;
