import React from "react";
import {
  formatUserFullName,
  getProfileImageUrl,
  getRoleName,
} from "../../../utils/userUtils";
import Button from "../../ui/Button";
import MessageIcon from "../../../assets/icons/MessageIcon";
import EmergencyContactIcon from "../../../assets/icons/EmergencyContactIcon";
import PhoneIcon from "../../../assets/icons/PhoneIcon";

const UserProfileHeader = ({ user }) => {
  const userFullName = formatUserFullName(user);
  const profileImageUrl = getProfileImageUrl(user?.profileImage);
  const roleName = getRoleName(user.role);

  return (
    <>
      {/* Desktop header  */}
      <div className="hidden lg:block px-30 pt-8">
        <div className="flex justify-between items-start ">
          {/* User info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-heading font-semibold">
              {userFullName}
            </h1>
            <p className="text-sm text-gray">
              Stable role: <span>{roleName || "Member"}</span>
            </p>
          </div>

          {/* Contact buttons */}
          <div className="flex gap-2 mt-6">
            {user.phoneNumber && (
              <Button
                type="secondary"
                className="rounded-lg !border-primary"
                aria-label="Phone"
              >
                <PhoneIcon className="text-primary mr-2" size={20} />
                {user.phoneNumber}
              </Button>
            )}

            {/* Emergency contact */}
            <Button
              type="secondary"
              className="rounded-lg !border-primary"
              aria-label="Emergency contact"
            >
              <EmergencyContactIcon className="text-primary mr-2" size={20} />
              {user.emergencyContact || "Phonenumber"}
            </Button>

            {/* Chatt */}
            <Button
              type="secondary"
              className="rounded-lg !border-primary"
              aria-label="Messenger"
            >
              <MessageIcon className="text-primary mr-2" size={20} />
              Messenger
            </Button>
          </div>
        </div>

        {/* Image carousel */}
        <div className="relative mt-4 border-2 border-primary rounded-lg overflow-hidden">
          <div className="w-full h-64 relative">
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
              Stable role: <span>{roleName || "Member"}</span>
            </p>
          </div>

          {/* Contact buttons */}
          <div className="flex justify-start gap-2 mt-6 md:justify-center md:px-20">
            <Button
              type="secondary"
              className="w-full h-13 md:h-12 md:w-9/10 !bg-primary-light !border-primary rounded-xl"
              aria-label="Phone"
            >
              <PhoneIcon className="text-primary" size={30} />
            </Button>
            <Button
              type="secondary"
              className="w-full h-13 md:h-12 md:w-9/10 !bg-primary-light !border-primary rounded-xl"
              aria-label="Emergency contact"
            >
              <EmergencyContactIcon className="text-primary" size={30} />
            </Button>
            <Button
              type="secondary"
              className="w-full h-13 md:h-12 md:w-9/10 !bg-primary-light !border-primary rounded-xl"
              aria-label="Messenger"
            >
              <MessageIcon className="text-primary" size={30} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileHeader;
