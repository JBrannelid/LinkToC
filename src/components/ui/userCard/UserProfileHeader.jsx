import React, { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import {
  formatUserFullName,
  getProfileImageUrl,
  getRoleName,
} from "../../../utils/userUtils";
import Button from "../../ui/Button";
import MessageIcon from "../../../assets/icons/MessageIcon";
import EmergencyContactIcon from "../../../assets/icons/EmergencyContactIcon";
import PhoneIcon from "../../../assets/icons/PhoneIcon";

const UserProfileHeader = ({ user, userProfile }) => {
  const { currentStable } = useAppContext();

  // Combine data from user and userProfile
  const userStableRole = userProfile?.userStableRole;
  const enhancedUser = userStableRole?.user || user;

  const userFullName = formatUserFullName(enhancedUser);
  const profileImageUrl = getProfileImageUrl(enhancedUser?.profileImage);

  // Get role from userProfile if available
  const userRole = userStableRole
    ? userStableRole.role
    : user.stableRoles
    ? user.stableRoles[currentStable?.id]
    : user.role;

  const roleName = getRoleName(userRole);

  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  // Use emergency contact from enhanced profile data if available
  const emergencyContact = enhancedUser?.emergencyContact;

  return (
    <>
      {/* Desktop header  */}
      <div className="hidden lg:block lg:px-40 xl:px-60 pt-8">
        <div className="flex justify-between items-start ">
          {/* User info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-heading font-semibold">
              {userFullName}
            </h1>
            <p className="text-sm text-gray">
              <span>{roleName || "Member"}</span>
            </p>
            <p className="text-sm text-gray">2004</p>
          </div>

          {/* Contact buttons */}
          <div className="flex flex-row gap-2 mr-5 mt-10">
            {enhancedUser.phoneNumber && (
              <Button
                type="secondary"
                className="rounded-lg !border-primary flex flex-col max-h-15"
                aria-label="Phone"
              >
                <PhoneIcon className="text-primary mb-1" size={20} />
                <span className="text-xs">{enhancedUser.phoneNumber}</span>
              </Button>
            )}

            {/* Emergency contact */}
            <Button
              type="secondary"
              className={`rounded-lg !border-primary flex flex-col max-h-15 ${
                !emergencyContact ? "opacity-40" : ""
              }`}
              aria-label="Emergency contact"
            >
              <EmergencyContactIcon className="text-primary mb-1" size={20} />
              <span className="text-xs">
                {emergencyContact || "No emergency contact"}
              </span>
            </Button>

            {/* Messenger */}
            <Button
              type="secondary"
              className="rounded-lg !border-primary flex flex-col max-h-15 opacity-40"
              aria-label="Messenger"
            >
              <MessageIcon className="text-primary mb-1" size={20} />
              <span className="text-xs">Messenger</span>
            </Button>
          </div>
        </div>

        {/* Image carousel */}
        <div className="relative mt-4 border-2 border-primary rounded-lg overflow-hidden">
          <div className="w-full h-55 relative">
            <img
              src={profileImageUrl}
              alt={`Profile of ${userFullName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden relative">
        {/* User image */}
        <div className="w-full sm:h-100 h-90 md:h-130">
          <img
            src={profileImageUrl}
            alt={`Profile of ${userFullName}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User info */}
        <div className="px-4 sm:px-6 md:px-8 py-6 bg-background rounded-t-3xl -mt-8 relative z-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-heading font-semibold">
              {userFullName}
            </h1>
            <p className="text-sm text-gray">
              <span>{roleName || "Unknown user role"}</span>
            </p>
          </div>
          <div className="flex justify-start gap-2 mt-6 md:justify-center md:px-20">
            {/* Contact buttons */}
            <div className="flex flex-col items-center w-full md:w-9/10">
              <Button
                type="secondary"
                className="w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl"
                aria-label="Phone"
                onClick={() => setShowPhoneNumber(!showPhoneNumber)}
              >
                {showPhoneNumber ? (
                  <span className="text-sm text-primary font-medium">
                    {enhancedUser.phoneNumber}
                  </span>
                ) : (
                  <PhoneIcon className="text-primary" size={30} />
                )}
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                Number
              </span>
            </div>

            {/* Emergency button */}
            <div className="flex flex-col items-center w-full md:w-9/10 opacity-40">
              <Button
                type="secondary"
                className="w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl"
                aria-label="Emergency contact"
              >
                <EmergencyContactIcon className="text-primary" size={30} />
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                Emergency contact
              </span>
            </div>

            {/* Messenger */}
            <div className="flex flex-col items-center w-full md:w-9/10 opacity-40">
              <Button
                type="secondary"
                className="w-full h-13 md:h-12 !bg-primary-light !border-primary rounded-xl"
                aria-label="Messenger"
              >
                <MessageIcon className="text-primary" size={30} />
              </Button>
              <span className="mt-1 text-xs text-center text-primary">
                Messenger
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileHeader;
