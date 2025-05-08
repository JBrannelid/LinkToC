import React, { useState } from "react";
import Button from "../ui/Button";
import { useStableManagement } from "../../hooks/useStableManagement";
import { USER_ROLES } from "../../context/AppContext";
import PenIcon from "../../assets/icons/PenIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import CheckIcon from "../../assets/icons/CheckIcon";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";
import PermissionGate from "../../components/settings/PermissionGate";

const ROLE_OPTIONS = [
  { id: USER_ROLES.USER, label: "Medlem" },
  { id: USER_ROLES.ADMIN, label: "Admin" },
  { id: USER_ROLES.MANAGER, label: "Stallägare" },
];

const StableMembersList = ({ stableId }) => {
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const { members, loading, updateMemberRole, removeMember } =
    useStableManagement(stableId);

  const handleShowEditModal = (member) => {
    setSelectedMember(member);
    setSelectedRole(member.role); // User existing role as default
    setShowRoleModal(true);
  };

  const handleConfirmRoleChange = () => {
    if (selectedMember && selectedRole !== null) {
      updateMemberRole(selectedMember.id, selectedRole);
      setShowRoleModal(false);
      setSelectedMember(null);
    }
  };

  const handleShowRemoveModal = (member) => {
    setSelectedMember(member);
    setShowRemoveMemberModal(true);
  };

  const handleConfirmRemove = () => {
    if (selectedMember) {
      removeMember(selectedMember.id);
      setShowRemoveMemberModal(false);
      setSelectedMember(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Laddar medlemmar...</div>;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm p-5">
      <h2 className="font-bold mb-1">Medlemmar</h2>
      <p className="text-sm mb-5 ">Enbart stallägare kan sätta användarroll</p>

      {/* Header */}
      <div className="space-y-1">
        <div className="grid grid-cols-5 py-1 px-1 text-sm text-gray">
          <div className="col-span-3">Namn</div>
          <div className="col-span-1 text-center">Roll</div>
          <div className="col-span-1 text-center">Kicka</div>
        </div>

        {/* Content - Display members */}
        {members.map((member) => (
          <div
            key={`member-${member.id}`}
            className="grid grid-cols-5 items-center bg-background rounded-full my-2"
          >
            <div className="col-span-3 pl-2">
              <span>{`${member.firstName} ${member.lastName}`}</span>
            </div>
            <div className="col-span-1 flex justify-center">
              <PermissionGate
                requiredRoles={[USER_ROLES.MANAGER]}
                fallback={
                  <Button
                    type="icon"
                    disabled={true}
                    aria-label="Kan inte redigera"
                    className="text-gray-300 cursor-not-allowed"
                  >
                    <PenIcon size={28} />
                  </Button>
                }
              >
                <Button
                  type="icon"
                  onClick={() => handleShowEditModal(member)}
                  aria-label="Redigera medlem"
                  className="text-primary"
                >
                  <PenIcon size={28} />
                </Button>
              </PermissionGate>
            </div>
            <div className="col-span-1 flex justify-center">
              <Button
                type="icon"
                onClick={() => handleShowRemoveModal(member)}
                aria-label="Ta bort medlem"
                className="text-error-500"
              >
                <TrashIcon size={25} />
              </Button>
            </div>
          </div>
        ))}

        {members.length === 0 && (
          <div className="py-3 text-center">
            <p className="text-warning-400"> Inga medlemmar i stallet</p>
          </div>
        )}
      </div>

      {/* Remove Member Modal */}
      <ConfirmationModal
        isOpen={showRemoveMemberModal}
        onClose={() => setShowRemoveMemberModal(false)}
        onConfirm={handleConfirmRemove}
        loading={loading}
        title={`Vill du kicka ${selectedMember?.firstName || "denna medlem"}?`}
        confirmButtonText="Ja"
        confirmButtonType="danger"
        icon={
          <HandRaisedIcon
            size={70}
            backgroundColor="bg-error-500"
            iconColor="text-white"
          />
        }
      />

      {/* Role Selection Modal */}
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${
          showRoleModal ? "block" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg w-80 p-5 max-w-md">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <CheckIcon
                size={70}
                className="text-white"
                backgroundColor="bg-primary"
                strokeWidth={4}
              />
            </div>
            <h3 className="text-xl font-medium">
              Välj roll för {selectedMember?.firstName || "användaren"}
            </h3>
          </div>

          {/* Role Selection */}
          <div className="space-y-3 mb-6">
            {ROLE_OPTIONS.map((role) => (
              <div
                key={role.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors ${
                  selectedRole === role.id
                    ? "border-primary bg-primary-light"
                    : "border-gray-200 hover:bg-light/60"
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="mr-3">
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      selectedRole === role.id
                        ? "border-primary bg-primary"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedRole === role.id && (
                      <CheckIcon className="text-white w-5 h-5" />
                    )}
                  </div>
                </div>
                <span className="flex-1">{role.label}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-2">
            <Button
              type="primary"
              className="w-full"
              onClick={handleConfirmRoleChange}
              disabled={selectedRole === null}
            >
              Spara
            </Button>
            <Button
              type="secondary"
              className="w-full"
              onClick={() => setShowRoleModal(false)}
            >
              Avbryt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StableMembersList;
