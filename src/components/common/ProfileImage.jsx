import { useState, useEffect, useCallback } from "react";
import { getReadSasUrl } from "../../api/services/fileService";

const DEFAULT_FALLBACK = "/images/userPlaceholderRounded.webp";

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
        return "/images/userPlaceholderSmall_NoLogo.webp";
      case "medium":
        return "/images/userPlaceholdermedium_NoLogo.webp";
      case "large":
        return "/images/userPlaceholderLarge_NoLogo.webp";
      case "rounded":
        return "/images/userPlaceholderRounded.webp";
      default:
        return DEFAULT_FALLBACK;
    }
  }, [fallbackUrl, size]);

  const [imageUrl, setImageUrl] = useState(getFallbackImage());
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || hasError) {
      setImageUrl(getFallbackImage());
      return;
    }

    const fetchImageUrl = async () => {
      try {
        setIsLoading(true);
        const ownerId = user.userId || user.id;

        if (!ownerId) {
          setImageUrl(getFallbackImage());
          return;
        }

        const profilePicture =
          user.profilePicture || user.ProfilePicture || user.profilePictureUrl;

        if (!profilePicture) {
          setImageUrl(getFallbackImage());
          return;
        }

        // Skip SAS generation if it's already a full URL
        if (profilePicture.startsWith("http")) {
          setImageUrl(profilePicture);
          return;
        }

        // Use blob path format
        const blobPath = `profile-pictures/${ownerId}/${profilePicture}`;

        try {
          // Use  SAS URL service
          const sasUrl = await getReadSasUrl(blobPath);
          if (sasUrl) {
            // Add cache-busting parameter
            const imageUrlWithCache = `${sasUrl}&t=${Date.now()}`;
            setImageUrl(imageUrlWithCache);
          } else {
            console.warn("No SAS URL received, using fallback");
            setImageUrl(getFallbackImage());
          }
        } catch (sasError) {
          console.warn("SAS URL generation failed:", sasError.message);
          setImageUrl(getFallbackImage());
        }
      } catch (error) {
        console.error("Profile image loading error:", error);
        setHasError(true);
        setImageUrl(getFallbackImage());
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageUrl();
  }, [user, hasError, getFallbackImage]);

  const userFullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
    : "User";

  return (
    <img
      src={imageUrl || getFallbackImage()}
      alt={alt || `Profile of ${userFullName}`}
      className={`object-cover ${className} ${isLoading ? "opacity-75" : ""}`}
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
