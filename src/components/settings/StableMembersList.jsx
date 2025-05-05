import React from "react";
import Button from "../ui/Button";
import { useStableManagement } from "../../hooks/useStableManagement";
import { USER_ROLES } from "../../context/AppContext";
import PenIcon from "../../assets/icons/PenIcon";
import TrashIcon from "../../assets/icons/TrashIcon";

const StableMembersList = ({ stableId }) => {
  const { members, loading, updateMemberRole, removeMember } =
    useStableManagement(stableId);

  const handleEditMember = (memberId) => {
    const newRole = window.confirm("Make this user an admin?")
      ? USER_ROLES.ADMIN
      : USER_ROLES.USER;
    updateMemberRole(memberId, newRole);
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      removeMember(memberId);
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
                onClick={() => handleRemoveMember(member.id)}
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
    </div>
  );
};

export default StableMembersList;
