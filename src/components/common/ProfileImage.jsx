import { useState, useEffect } from "react";
import { getReadSasUrl } from "../../api/services/fileService";

const DEFAULT_FALLBACK = "/src/assets/images/userPlaceholderRounded.webp";

const ProfileImage = ({
  user,
  size = "default",
  className = "",
  alt = "",
  fallbackUrl = null,
}) => {
  // Fallback image with s,m,l,rounded sizes
  const getFallbackImage = () => {
    if (fallbackUrl) return fallbackUrl;

    switch (size) {
      case "small":
        return "/src/assets/images/userPlaceholderSmall.webp";
      case "medium":
        return "/src/assets/images/userPlaceholdermedium.webp";
      case "large":
        return "/src/assets/images/userPlaceholderLarge.webp";
      case "rounded":
        return "/src/assets/images/userPlaceholderRounded.webp";
      default:
        return DEFAULT_FALLBACK;
    }
  };

  const [imageUrl, setImageUrl] = useState(getFallbackImage());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchImageUrl = async () => {
      try {
        // Try all possible profile image field names
        const profilePicture =
          user.profilePicture ||
          user.ProfilePicture ||
          user.profileImage ||
          user.profilePictureUrl ||
          user.userProfileImage ||
          user.image;

        // Determine user ID from all possible fields
        const userId =
          user.id ||
          user.userId ||
          (profilePicture &&
          typeof profilePicture === "string" &&
          profilePicture.match(/\/(\d+)\//)
            ? profilePicture.match(/\/(\d+)\//)[1]
            : null);

        if (!profilePicture || !userId) {
          return;
        }

        // Try to get full URL with SAS
        try {
          const sasUrl = await getReadSasUrl(profilePicture, userId);
          if (sasUrl) {
            setImageUrl(`${sasUrl}&t=${Date.now()}`);
            return;
          }
        } catch (sasError) {
          console.warn("Could not get SAS URL:", sasError);
        }

        // Fallback: Try direct URL construction
        try {
          // If profilePicture already has a full URL format, use it directly
          if (profilePicture.startsWith("http")) {
            setImageUrl(`${profilePicture}?t=${Date.now()}`);
            return;
          }

          // Otherwise try to construct the Blob Storage URL
          const baseUrl =
            "http://127.0.0.1:10000/devstoreaccount1/equilog-media";

          // Handle profile picture being a full path or just a filename
          const picturePath = profilePicture.includes("/")
            ? profilePicture
            : `profile-pictures/${userId}/${profilePicture}`;

          const directUrl = `${baseUrl}/${picturePath}?t=${Date.now()}`;
          setImageUrl(directUrl);
        } catch (directUrlError) {
          console.warn("Could not construct direct URL:", directUrlError);
          setHasError(true);
        }
      } catch (error) {
        console.error("Profile image processing error:", error);
        setHasError(true);
      }
    };

    fetchImageUrl();
  }, [user, size, fallbackUrl]);

  const userFullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
    : "User";

  // Add a null check to prevent empty string src
  const imageSrc = imageUrl || getFallbackImage() || DEFAULT_FALLBACK;

  return (
    <img
      src={imageSrc}
      alt={alt || `Profile of ${userFullName}`}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={(e) => {
        if (!hasError) {
          setHasError(true);
          setImageUrl(getFallbackImage() || DEFAULT_FALLBACK);
        }
      }}
    />
  );
};

export default ProfileImage;
