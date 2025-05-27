import React, { useState } from "react";
import PermissionGate from "./PermissionGate";
import CheckIcon from "../../assets/icons/CheckIcon";
import { useStableManagement } from "../../hooks/useStableManagement";
import { USER_ROLES } from "../../utils/userUtils";
import ProfileImage from "../common/ProfileImage";
import Button from "../ui/Button";

const ROLE_OPTIONS = [
  { id: USER_ROLES.USER, label: "Member" },
  { id: USER_ROLES.ADMIN, label: "Admin" },
  { id: USER_ROLES.MANAGER, label: "Owner" },
];

const StableMembersList = ({ stableId }) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const { members, loading, updateMemberRole, removeUserFromStable } =
    useStableManagement(stableId);

  const handleClickMember = (member) => {
    setSelectedMember(member);
    setSelectedRole(member.role);
    setShowActionModal(true);
  };

  const handleCloseModal = () => {
    setShowActionModal(false);
    setSelectedMember(null);
  };

  const handleConfirmRoleChange = async () => {
    if (
      selectedMember &&
      selectedRole !== null &&
      selectedRole !== selectedMember.role
    ) {
      const success = await updateMemberRole(selectedMember.id, selectedRole);
      if (success) {
        // Role updated successfully - the hook will refresh the data
      } else {
        console.error("Failed to update role");
      }
      handleCloseModal();
    }
  };

  const handleRemoveMember = () => {
    if (selectedMember) {
      removeUserFromStable(selectedMember.id);
      handleCloseModal();
    }
  };

  const getRoleName = (roleId) => {
    const role = ROLE_OPTIONS.find((r) => r.id === roleId);
    return role ? role.label : "Member";
  };

  // Group members by role
  const groupedMembers = {
    [USER_ROLES.MANAGER]: members.filter((m) => m.role === USER_ROLES.MANAGER),
    [USER_ROLES.ADMIN]: members.filter((m) => m.role === USER_ROLES.ADMIN),
    [USER_ROLES.USER]: members.filter((m) => m.role === USER_ROLES.USER),
  };

  if (loading) {
    return <div className="text-center py-4">Loading members...</div>;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm md:shadow-md p-4 md:p-6">
      <header>
        <h2 className="font-bold mb-1 text-lg md:text-xl">Members</h2>
        <PermissionGate
          requiredRoles={[USER_ROLES.MANAGER]}
          fallback={
            <p className="text-sm mb-4 pt-1 text-gray">
              Only stable owners can edit a member
            </p>
          }
        >
          <p className="text-sm mb-4 pt-1 text-gray">
            You can manage all members as the stable owner
          </p>
        </PermissionGate>
      </header>

      {/* List container with scroll */}
      <div className="max-h-64 md:max-h-80 lg:max-h-96 overflow-y-auto pr-1 space-y-1">
        {/* Managers */}
        {groupedMembers[USER_ROLES.MANAGER].length > 0 && (
          <section className="mb-3">
            <h3 className="text-xs text-gray border-b pb-1 mb-2">
              Stable Owners
            </h3>
            {groupedMembers[USER_ROLES.MANAGER].map((member) => (
              <PermissionGate
                key={`member-${member.id}`}
                requiredRoles={[USER_ROLES.MANAGER]}
              >
                <article
                  className="flex items-center justify-between py-2 px-3 bg-light/30 rounded-lg mb-2 cursor-pointer"
                  onClick={() => handleClickMember(member)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <ProfileImage
                        user={member}
                        className="w-full h-full"
                        size="small"
                      />
                    </div>
                    <p className="text-sm">{`${member.firstName} ${member.lastName}`}</p>
                  </div>
                </article>
              </PermissionGate>
            ))}
          </section>
        )}

        {/* Admins */}
        {groupedMembers[USER_ROLES.ADMIN].length > 0 && (
          <section className="mb-3">
            <PermissionGate requiredRoles={[USER_ROLES.MANAGER]}>
              <h3 className="text-xs text-gray border-b pb-1 mb-2">
                Administrators
              </h3>
            </PermissionGate>
            {groupedMembers[USER_ROLES.ADMIN].map((member) => (
              <PermissionGate
                key={`member-${member.id}`}
                requiredRoles={[USER_ROLES.MANAGER]}
              >
                <article
                  className="flex items-center justify-between py-2 px-3 bg-light/30 rounded-lg mb-2 cursor-pointer"
                  onClick={() => handleClickMember(member)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <ProfileImage
                        user={member}
                        className="w-full h-full"
                        size="small"
                      />
                    </div>
                    <p className="text-sm">{`${member.firstName} ${member.lastName}`}</p>
                  </div>
                  <span className="px-2 py-1 bg-primary-light text-primary rounded-full text-sm">
                    {getRoleName(member.role)}
                  </span>
                </article>
              </PermissionGate>
            ))}
          </section>
        )}

        {/* Regular Members */}
        {groupedMembers[USER_ROLES.USER].length > 0 && (
          <section className="mb-3">
            <PermissionGate requiredRoles={[USER_ROLES.MANAGER]}>
              <h3 className="text-xs text-gray border-b pb-1 mb-2">Members</h3>
            </PermissionGate>
            {groupedMembers[USER_ROLES.USER].map((member) => (
              <PermissionGate
                key={`member-${member.id}`}
                requiredRoles={[USER_ROLES.MANAGER]}
              >
                <article
                  className="flex items-center justify-between py-2 px-3 bg-light/30 rounded-lg mb-2 cursor-pointer"
                  onClick={() => handleClickMember(member)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <ProfileImage
                        user={member}
                        className="w-full h-full"
                        size="small"
                      />
                    </div>
                    <p className="text-sm">{`${member.firstName} ${member.lastName}`}</p>
                  </div>
                  <span className="px-2 py-1 bg-primary-light text-primary rounded-full text-sm">
                    {getRoleName(member.role)}
                  </span>
                </article>
              </PermissionGate>
            ))}
          </section>
        )}
      </div>

      {/* Member Action Modal */}
      {showActionModal && selectedMember && (
        <div className="fixed inset-0 bg-gray/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-md p-4">
            <h3 className="mb-2 text-lg">
              Manage member{" "}
              <span className="text-sm font-semibold text-primary">
                {selectedMember.firstName} {selectedMember.lastName}
              </span>
            </h3>

            {/* Options layout */}
            <div className="border-t py-3 mb-2">
              <fieldset className="grid grid-cols-4 gap-1 mb-3">
                {ROLE_OPTIONS.map((role) => (
                  <div key={role.id} className="text-center">
                    <label className="text-sm mb-2 block">{role.label}</label>
                    <div
                      className={`w-5 h-5 mx-auto rounded-full border flex items-center justify-center cursor-pointer ${
                        selectedRole === role.id
                          ? "border-primary bg-primary"
                          : "border-gray"
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                      role="radio"
                      aria-checked={selectedRole === role.id}
                      tabIndex={0}
                    >
                      {selectedRole === role.id && (
                        <CheckIcon className="text-white w-4 h-4" />
                      )}
                    </div>
                  </div>
                ))}
                {/* Remove option */}
                <div className="text-center">
                  <label className="text-sm mb-2 text-error-500 block">
                    Remove
                  </label>
                  <div
                    className={`w-5 h-5 mx-auto rounded-full border flex items-center justify-center cursor-pointer ${
                      selectedRole === "remove"
                        ? "border-error-500 bg-error-500"
                        : "border-gray"
                    }`}
                    onClick={() => setSelectedRole("remove")}
                    role="radio"
                    aria-checked={selectedRole === "remove"}
                    tabIndex={0}
                  >
                    {selectedRole === "remove" && (
                      <CheckIcon className="text-white w-4 h-4" />
                    )}
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Action Buttons Cancel/Save*/}
            <div className="grid grid-cols-2 gap-3">
              <Button type="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  if (selectedRole === "remove") {
                    handleRemoveMember();
                  } else if (
                    selectedRole !== null &&
                    selectedRole !== selectedMember.role
                  ) {
                    handleConfirmRoleChange();
                  }
                }}
                disabled={
                  selectedRole === null ||
                  (selectedRole !== "remove" &&
                    selectedRole === selectedMember.role)
                }
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StableMembersList;
