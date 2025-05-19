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
          <div key={index}>
            <UserProfileImage
              user={user}
              size="small"
              className="border border-background md:h-4.2 md:w-4.2 lg:h-4 lg:w-4 xl:h-5 xl:w-5"
            />
          </div>
        ))}

        {exceedsMaximumUserImage && (
          <UserProfileImage
            user={{ id: "counter" }}
            size="small"
            className="border border-background md:h-4.2 md:w-4.2 lg:h-4 lg:w-4 xl:h-5 xl:w-5"
            customContent={`+${remainingUsersCount}`}
          />
        )}
      </div>
    </div>
  );
};

export default UserAvatarGrid;
