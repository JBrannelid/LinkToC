import React from "react";
import Card from "../ui/card";
import {
  formatUserFullName,
  getProfileImageUrl,
  getRoleName,
} from "../../utils/userUtils";

const MemberCard = ({ member, onClick }) => {
  const fullName = formatUserFullName(member);
  const hasCustomProfileImage = !!member.profileImage;
  const roleName = getRoleName(member.role);

  return (
    <Card.Container className="cursor-pointer" onClick={onClick}>
      <div className="p-2 flex flex-col">
        <div className="flex justify-center">
          <div className="w-24 h-24 mb-2 rounded-full overflow-hidden border-2 border-primary lg:w-full lg:h-30 lg:rounded-md">
            {hasCustomProfileImage ? (
              // User has a custom profile image
              <img
                src={member.profileImage}
                alt={`Profile picture of ${fullName}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              // Use responsive placeholder images based on screen size
              <picture>
                <source
                  media="(min-width: 1024px)"
                  srcSet="/src/assets/images/userPlaceholderLarge.webp"
                />
                <source
                  media="(min-width: 768px)"
                  srcSet="/src/assets/images/userPlaceholdermedium.webp"
                />
                <img
                  src="/src/assets/images/userPlaceholderSmall.webp"
                  alt={`Profile picture of ${fullName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </picture>
            )}
          </div>
        </div>
        <Card.Title className="text-xs !text-start">{fullName}</Card.Title>
        {roleName && (
          <Card.Subtitle className="text-xs !text-start">
            {roleName}
          </Card.Subtitle>
        )}
      </div>
    </Card.Container>
  );
};

export default MemberCard;
