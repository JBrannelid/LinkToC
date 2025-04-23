import React from "react";

const UserProfileImage = ({ user, size = "medium", className = "" }) => {
  // STEP 1: Set up the size of the avatar circle based on the size prop
  let sizeClass = "h-10 w-10";

  if (size === "mini") {
    sizeClass = "h-5 w-5";
  } else if (size === "tiny") {
    sizeClass = "h-6 w-6";
  } else if (size === "small") {
    sizeClass = "h-8 w-8";
  } else if (size === "large") {
    sizeClass = "h-12 w-12";
  }

  // STEP 2: Determine font size for the initials
  let fontSizeClass = "text-sm";

  if (size === "mini" || size === "tiny") {
    fontSizeClass = "text-xs";
  }

  // STEP 3: Get user's initials
  function getInitials() {
    if (!user) {
      return "?";
    }
    if (user.firstName && user.lastName) {
      return user.firstName.charAt(0) + user.lastName.charAt(0);
    }
    return "U";
  }

  // STEP 4: Get a background color based on user ID
  function getBackgroundColor() {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ];

    if (typeof user.id === "number") {
      const colorIndex = user.id % colors.length;
      return colors[colorIndex];
    }
    return "bg-gray-400";
  }

  // STEP 5: Get a user name for the image alt text
  function getUserDisplayName() {
    if (!user) return "User";

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return `Okänd användare`;
  }

  const altText =
    user && user.profileImage
      ? `Profil picture for ${getUserDisplayName()}`
      : `Initials for ${getUserDisplayName()}`;

  return (
    <div
      className={`${sizeClass} ${getBackgroundColor()} rounded-full flex items-center justify-center text-white ${className}`}
    >
      {user && user.profileImage ? (
        <img
          src={user.profileImage}
          alt={altText}
          className={`${sizeClass} rounded-full object-cover`}
        />
      ) : (
        <span className={`${fontSizeClass} font-semibold`}>
          {getInitials()}
        </span>
      )}
    </div>
  );
};

export default UserProfileImage;
