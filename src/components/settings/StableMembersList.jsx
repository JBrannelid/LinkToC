import React, { useState } from "react";
import Button from "../ui/Button";
import { useStableManagement } from "../../hooks/useStableManagement";
import { USER_ROLES } from "../../context/AppContext";
import PenIcon from "../../assets/icons/PenIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import HandRaisedIcon from "../../assets/icons/HandRaisedIcon";

const StableMembersList = ({ stableId }) => {
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { members, loading, updateMemberRole, removeMember } =
    useStableManagement(stableId);

  const handleEditMember = (memberId) => {
    const newRole = window.confirm("Make this user an admin?")
      ? USER_ROLES.ADMIN
      : USER_ROLES.USER;
    updateMemberRole(memberId, newRole);
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
      <h2 className="mb-5 font-bold">Medlemmar</h2>

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
            key={member.id}
            className="grid grid-cols-5 items-center bg-background rounded-full my-2"
          >
            <div className="col-span-3 pl-2">
              <span>{`${member.firstName} ${member.lastName}`}</span>
            </div>
            <div className="col-span-1 flex justify-center">
              <Button
                type="icon"
                onClick={() => handleEditMember(member.id)}
                aria-label="Redigera medlem"
                className="text-primary"
              >
                <PenIcon size={28} />
              </Button>
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
    </div>
  );
};

export default StableMembersList;
