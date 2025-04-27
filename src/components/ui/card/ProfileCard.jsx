import React, { useState, useRef } from "react";
import Card, { classNames } from "../../../utils/cardUtils.js";
import {
  triggerFileUpload,
  handleImageUpload,
} from "../../../utils/imagesUtils.js";

const ProfileCard = ({
  id,
  name,
  imageUrl,
  description,

  entityType = "profile",
  altTextDetails = {},
  getAltText = null,

  metadata = [],

  stats = [],

  allowImageUpload = true,
  showDetailsButton = true,
  onDetailsClick = null,

  containerClassName = "",
  imageClassName = "",

  placeholderImageUrl = "",
  notFoundText = "",
}) => {
  const [profileImage, setProfileImage] = useState(imageUrl || null);
  const fileInputRef = useRef(null);

  let altText = `Profile of ${name}`;
  if (getAltText) {
    altText = getAltText(name, altTextDetails);
  } else if (entityType === "horse") {
    const { color, breed } = altTextDetails;
    altText = `${color || ""} ${breed || ""} horse named ${name}`.trim();
  } else if (entityType === "user") {
    const { role, department } = altTextDetails;
    if (role && department) {
      altText = `${role} ${name} from ${department} department`;
    } else if (role) {
      altText = `${role} ${name}`;
    }
  }

  if (!id || !name) {
    return (
      <div
        className={classNames(
          "p-4",
          "bg-gray-100",
          "rounded-lg",
          "max-w-md",
          "mx-auto"
        )}
      >
        <p className="text-center">{notFoundText}</p>
      </div>
    );
  }

  const titleId = `profile${id}-title`;
  const descId = `profile${id}-desc`;
  const imageToDisplay = profileImage || placeholderImageUrl;
  const metadataText = metadata.length > 0 ? metadata.join(" • ") : "";

  return (
    <Card.Container
      id={`profile-${id}`}
      ariaLabelledby={titleId}
      ariaDescribedby={descId}
      className={containerClassName}
    >
      <Card.Image
        src={imageToDisplay}
        alt={altText}
        className={classNames(!profileImage && "opacity-80", imageClassName)}
      />
      <Card.Header>
        <Card.Title id={titleId}>{name}</Card.Title>
        {metadataText && <Card.Subtitle>{metadataText}</Card.Subtitle>}
      </Card.Header>
      <Card.Body id={descId}>
        <p>{description}</p>
        {stats.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h4 className="font-semibold mb-2">Statistics</h4>
            <ul className="grid grid-cols-3 gap-2">
              {stats.map((stat, index) => (
                <li key={index} className={stat.className}>
                  <span className="block text-sm text-gray-500">
                    {stat.label}
                  </span>
                  <span>{stat.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card.Body>
      <Card.Footer>
        <div className="flex space-x-2">
          {showDetailsButton && (
            <Button
              type="primary"
              onClick={onDetailsClick}
              aria-label={`View full details for ${name}`}
            >
              View Full Details
            </Button>
          )}

          {allowImageUpload && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                id={`profile-${id}-image-upload`}
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setProfileImage)}
                style={{ display: "none" }}
              />
              <Button
                type={profileImage ? "secondary" : "primary"}
                onClick={() => triggerFileUpload(fileInputRef)}
                aria-label={`Upload profile picture for ${id.name}`}
              >
                {profileImage ? "Uppdatera foto" : "Lägg till nytt foto"}
              </Button>
            </>
          )}
        </div>
      </Card.Footer>
    </Card.Container>
  );
};

export default ProfileCard;
