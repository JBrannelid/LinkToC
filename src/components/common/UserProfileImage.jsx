import { useState } from "react";

const UserProfileImage = ({
  user,
  size = "small",
  className = "",
  customContent,
  placeholderUrl = "/src/assets/images/userPlaceholder.webp",
}) => {
  // STEP 1: Set up the size of the avatar circle based on the size prop
  let sizeClass = "h-4 w-4";
  if (size === "medium") {
    sizeClass = "h-8 w-8";
  } else if (size === "large") {
    sizeClass = "h-12 w-12";
  }

  // STEP 2: Determine font size for the initials
  let fontSizeClass = "text-sm";
  if (size === "small") {
    fontSizeClass = "text-mini";
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
      "bg-orange-500",
      "bg-lime-500",
      "bg-amber-500",
      "bg-cyan-500",
      "bg-rose-500",
      "bg-fuchsia-500",
    ];

    if (typeof user?.id === "number") {
      const colorIndex = user.id % colors.length;
      return colors[colorIndex];
    }
    return "bg-gray-500";
  }

  // STEP 5: Get a user name for the image alt text
  function getUserDisplayName() {
    if (!user) return "User";

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return `Unknown user`;
  }

  const altText = `${
    user && user.profilePictureUrl ? "Profile picture" : "Initials"
  } for ${getUserDisplayName()}`;

  // STEP 6: Handle image error - when the image fails to load, we'll show initials instead
  const [imageError, setImageError] = useState(false);

  // Check if we have a valid image URL and no error has occurred
  const hasValidImage = user?.profilePictureUrl && !imageError;

  return (
    <div
      className={`${sizeClass} ${getBackgroundColor()} rounded-full flex items-center justify-center text-white ${className}`}
    >
      {hasValidImage ? (
        <img
          src={user.profilePictureUrl}
          alt={altText}
          className={`${sizeClass} rounded-full object-cover`}
          loading="lazy"
          onError={(e) => {
            console.log("Image failed to load:", user.profilePictureUrl);
            setImageError(true);
          }}
        />
      ) : user && !placeholderUrl ? (
        // Use the placeholder image instead of showing initials when placeholderUrl is provided
        <img
          src={placeholderUrl}
          alt={altText}
          loading="lazy"
          className={`${sizeClass} rounded-full object-cover`}
          onError={() => {
            // Fall back to initials if placeholder also fails
            setImageError(true);
          }}
        />
      ) : (
        <span className={`${fontSizeClass} lg:text-[8px] font-normal`}>
          {customContent || getInitials()}
        </span>
      )}
    </div>
  );
};

export default UserProfileImage;
