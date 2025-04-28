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
        // Prevent redender from parent elements
        e.stopPropagation();

        if (onSelectUser && users.length > 0) {
          onSelectUser(users[0].id);
        }
      }}
    >
      <div className="grid grid-cols-2 pl-0.5 gap-0.5 max-w-full max-h-full">
        {displayUsers.map((user, index) => (
          <div key={index}>
            <UserProfileImage
              user={user}
              size="mini"
              className="border border-background"
            />
          </div>
        ))}

        {exceedsMaximumUserImage && (
          <div className="flex justify-start items-start">
            <UserProfileImage
              user={{ id: "counter" }}
              size="mini"
              className="border border-background"
              customContent={`+${remainingUsersCount}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatarGrid;
