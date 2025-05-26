import { useState, useEffect, useCallback } from "react";
import { getReadSasUrl } from "../../api/services/fileService";

const DEFAULT_FALLBACK = "/src/assets/images/userPlaceholderRounded.webp";

const ProfileImage = ({
  user,
  size = "default",
  className = "",
  alt = "",
  fallbackUrl = null,
}) => {
  const getFallbackImage = useCallback(() => {
    if (fallbackUrl) return fallbackUrl;

    switch (size) {
      case "small":
        return "/src/assets/images/userPlaceholderSmall_NoLogo.webp";
      case "medium":
        return "/src/assets/images/userPlaceholdermedium_NoLogo.webp";
      case "large":
        return "/src/assets/images/userPlaceholderLarge_NoLogo.webp";
      case "rounded":
        return "/src/assets/images/userPlaceholderRounded.webp";
      default:
        return DEFAULT_FALLBACK;
    }
  }, [fallbackUrl, size]);

  const [imageUrl, setImageUrl] = useState(getFallbackImage());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchImageUrl = async () => {
      try {
        const ownerId = user.userId || user.id;

        if (!ownerId) {
          setImageUrl(getFallbackImage());
          return;
        }

        const profilePicture =
          user.profilePicture ||
          user.ProfilePicture ||
          user.profileImage ||
          user.profilePictureUrl ||
          user.userProfileImage ||
          user.image;

        if (!profilePicture) {
          setImageUrl(getFallbackImage());
          return;
        }

        const blobPath = `profile-pictures/${ownerId}/${profilePicture}`;

        try {
          const sasUrl = await getReadSasUrl(blobPath);
          if (sasUrl) {
            const imageUrlWithCache = `${sasUrl}&t=${Date.now()}`;
            setImageUrl(imageUrlWithCache);
          } else {
            setImageUrl(getFallbackImage());
          }
        } catch (sasError) {
          console.warn("SAS URL error:", sasError);
          setImageUrl(getFallbackImage());
        }
      } catch (error) {
        console.error("Profile image error:", error);
        setHasError(true);
        setImageUrl(getFallbackImage());
      }
    };

    if (user && !hasError) {
      fetchImageUrl();
    }
  }, [user, hasError]);

  const userFullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
    : "User";

  return (
    <img
      src={imageUrl || getFallbackImage()}
      alt={alt || `Profile of ${userFullName}`}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImageUrl(getFallbackImage());
        }
      }}
    />
  );
};

export default ProfileImage;
