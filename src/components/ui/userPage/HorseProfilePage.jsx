import React, { useRef, useState } from "react";
import {
  PageContainer,
  PageBody,
  ProfileTabs,
  NotFoundState,
  PageImage,
} from "./";
import PropTypes from "prop-types";
import {
  getHorseImageAltText,
  formatHorseMetadata,
} from "../../../utils/horseProfileUtils.js";
import { useHorseProfile } from "../../../hooks/useHorseHook.js";
import {
  handleImageUpload,
  triggerFileUpload,
} from "../../../utils/imagesUtils.js";
import { classNames } from "../../../utils/cardUtils.js";
import { getHorseTabs } from "./HorseProfileTabs";
import LoadingSpinner from "../LoadingSpinner.jsx";

export const ProfilePage = ({
  horseId,
  imageUrl,
  notFoundText = "Ingen hästprofil hittades",
  placeholderImageUrl,
}) => {
  const { horse, loading, error } = useHorseProfile(horseId);
  const [profileImage, setProfileImage] = useState(imageUrl || null);
  const fileInputRef = useRef(null);

  if (loading)
    return (
      <div className="flex items-center py-2">
        <LoadingSpinner size="small" className="text-gray" />
        <span>Laddar...</span>
      </div>
    );

  if (error || !horse) {
    return <NotFoundState text={notFoundText} />;
  }

  const tabs = getHorseTabs(horse);
  return (
    <PageContainer>
      <PageBody>
        <PageImage
          src={imageUrl || placeholderImageUrl}
          alt={getHorseImageAltText(horse)}
          onError={() => {}}
          fallbackSrc={placeholderImageUrl}
        />
        <div className="flex space-x-2 mt-4">
          <input
            type="file"
            ref={fileInputRef}
            id={`profile-${horseId}-image-upload`}
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setProfileImage)}
            style={{ display: "none" }}
          />
          <button
            onClick={() => triggerFileUpload(fileInputRef)}
            className={classNames(
              "px-4",
              "py-2",
              "bg-gray-500",
              "hover:bg-gray-600",
              "text-white",
              "rounded",
              "focus:outline-none",
              "focus:ring-2",
              "focus:ring-gray-500",
              "focus:ring-offset-2",
              !profileImage && "bg-green-500 hover:bg-green-600"
            )}
            aria-label={`Upload profile picture for ${horse.name}`}
          >
            {profileImage ? "Update Photo" : "Add Photo"}
          </button>
        </div>

        <div className="card-content">
          <h1 className="text-xl font-bold">{horse.name}</h1>
          <p>{formatHorseMetadata(horse)}</p>
        </div>
        <ProfileTabs tabs={tabs} />
      </PageBody>
    </PageContainer>
  );
};

ProfilePage.propTypes = {
  horseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imageUrl: PropTypes.string,
  loadingText: PropTypes.string,
  notFoundText: PropTypes.string,
  placeholderImageUrl: PropTypes.string,
};
