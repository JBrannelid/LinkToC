import React, { useState } from "react";
import PermissionGate from "./PermissionGate";
import PlusIcon from "../../assets/icons/PlusIcon";
import {
  HORSE_CATEGORIES,
  CATEGORY_LABELS,
} from "../../context/constants/horseConstants.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useHorseManagement } from "../../hooks/useHorseManagement";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";

const HorseList = ({ stableId }) => {
  const { UserRoles, currentUser } = useAppContext();

  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [horseForm, setHorseForm] = useState({
    name: "",
    breed: "",
    color: "",
    age: "",
  });
  const {
    horses,
    loading,
    addHorse,
    updateHorse,
    deleteHorse,
    removeHorseFromStable,
    loadingState,
    error,
  } = useHorseManagement(stableId);

  const resetMessage = () => {
    setActionError(null);
    setActionSuccess(null);
  };
  const handleAdd = () => {
    resetMessage();
    setActionType("add");
    setHorseForm({
      name: "",
      breed: "",
      color: "",
      age: "",
    });
    setShowActionModal(true);
  };

  const handleEdit = (horse) => {
    setActionType("edit");
    setSelectedHorse(horse);
    setHorseForm({
      name: horse.name || "",
      breed: horse.breed || "",
      color: horse.color || "",
      age: horse.age ? new Date(horse.age).toISOString().split("T")[0] : "",
    });
    setShowActionModal(true);
  };

  const handleDelete = (horse) => {
    resetMessage();
    setActionType("delete");
    setSelectedHorse(horse);
    setShowActionModal(true);
  };

  const handleCloseModal = () => {
    if (!loading) {
      setShowActionModal(false);
      setSelectedHorse(null);
      setActionType(null);
      resetMessage();
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHorseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    resetMessage();
    let result;

    try {
      if (actionType === "add") {
        // Add the user ID from the context we're already using
        result = await addHorse(horseForm, currentUser?.id);
      } else if (actionType === "edit" && selectedHorse) {
        result = await updateHorse(selectedHorse.id, horseForm);
      } else if (actionType === "delete" && selectedHorse) {
        result = await deleteHorse(selectedHorse.id);
      } else if (actionType === "remove" && selectedHorse) {
        result = await removeHorseFromStable(selectedHorse.stableHorseId);
      }

      // Handle the response
      if (result && result.success) {
        setActionSuccess(
          actionType === "add"
            ? "🐴 New horse recruited for glory!"
            : actionType === "edit"
            ? "✏️ Horse info polished to perfection!"
            : actionType === "delete"
            ? "🗑️ Horse sent galloping into the sunset!"
            : "🏇 Horse trotted away from the stable!"
        );
        setActionSuccess("🐎 Message cleared. Back to the stables!");
        handleCloseModal();
      } else if (result && !result.success) {
        setActionError(
          result.error?.message || result.message || "Operation failed"
        );
      }
    } catch (error) {
      setActionError(error.message || "An unexpected error occurred");
    }
  };

  const formatAge = (age) => {
    if (!age) return "";

    try {
      const birthDate = new Date(age);
      if (isNaN(birthDate.getTime())) return "";

      // Calculate years
      const today = new Date();
      let yearDiff = today.getFullYear() - birthDate.getFullYear();

      // Adjust if birthday hasn't occurred yet this year
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        yearDiff--;
      }

      return `${yearDiff} years old`;
    } catch (error) {
      console.error("Error formatting age:", error);
      return "";
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm md:shadow-md p-4 md:p-6">
      {/* Header with Add Horse button - always visible */}
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-lg md:text-xl">
            {CATEGORY_LABELS[HORSE_CATEGORIES.OWNED]}
          </h2>
          <PermissionGate
            requiredRoles={[UserRoles.MANAGER, UserRoles.ADMIN]}
            fallback={
              <p className="text-sm mt-1 text-gray">
                Contact a stable administrator to manage horses
              </p>
            }
          >
            <p className="text-sm mt-1 text-gray">
              Manage the horses in your stable
            </p>
          </PermissionGate>
        </div>

        <PermissionGate requiredRoles={[UserRoles.MANAGER, UserRoles.ADMIN]}>
          {/* Mobile */}
          <Button
            variant="icon"
            size="small"
            className="!bg-primary !rounded-full md:hidden"
            onClick={handleAdd}
            aria-label="Add new horse"
          >
            <PlusIcon className="h-5 w-5 text-white" strokeWidth={3} />
          </Button>

          {/* md and above */}
          <Button
            type="primary"
            onClick={handleAdd}
            className="hidden md:flex md:items-center"
            aria-label="Add new horse"
          >
            Add Horse
          </Button>
        </PermissionGate>
      </header>

      {/* Content area - shown when not loading and no error */}
      {loading && !showActionModal ? (
        <div>
          <LoadingSpinner size="medium" />
          <p className="mt-2">{loadingState.getMessage()}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">Error loading horses: {error}</p>
          <Button
            type="primary"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="max-h-64 md:max-h-80 lg:max-h-96 overflow-y-auto pr-1 space-y-1">
          {horses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray mb-2">
                No horses added to this stable yet
              </p>
              <p className="text-sm text-gray">
                Use the "Add Horse" button to add your first horse
              </p>
            </div>
          ) : (
            horses.map((horse, index) => (
              <article
                key={`horse-${horse.id || index}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-3 bg-light/30 rounded-lg mb-2"
              >
                <div className="mb-2 sm:mb-0">
                  <h3 className="text-base font-medium">
                    {horse.name || "Unnamed Horse"}
                  </h3>
                  <p className="text-sm text-gray">
                    {[horse.breed, horse.color, formatAge(horse.age)]
                      .filter(Boolean)
                      .join(", ") || "No additional details"}
                  </p>
                  {horse.owner && (
                    <p className="text-xs text-gray mt-1">
                      Owner: {horse.owner.firstName} {horse.owner.lastName}
                    </p>
                  )}
                </div>

                <PermissionGate
                  requiredRoles={[UserRoles.MANAGER, UserRoles.ADMIN]}
                >
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <Button
                      type="icon"
                      onClick={() => handleEdit(horse)}
                      aria-label={`Edit ${horse.name || "this horse"}`}
                      className="text-primary text-sm"
                    >
                      Edit
                    </Button>

                    <Button
                      type="icon"
                      onClick={() => handleDelete(horse)}
                      aria-label={`Delete ${horse.name || "this horse"}`}
                      className="text-error-500 text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </PermissionGate>
              </article>
            ))
          )}
        </div>
      )}

      {/* Action Modal for Add/Edit/Delete/Remove */}
      {showActionModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg border border-primary-light w-11/12 max-w-md p-4">
            {/* Modal Header */}
            <h3 className="mb-4 text-lg font-bold">
              {actionType === "add"
                ? "Add New Horse"
                : actionType === "edit"
                ? `Edit ${selectedHorse?.name}`
                : actionType === "delete"
                ? `Delete ${selectedHorse?.name}`
                : `Remove ${selectedHorse?.name} from stable`}
            </h3>

            {/* Success and Error Messages */}
            {actionSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 p-2 mb-4 rounded">
                <p className="text-green-700">{actionSuccess}</p>
              </div>
            )}

            {actionError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-4 rounded">
                <p className="text-red-700">{actionError}</p>
              </div>
            )}

            {/* Modal Content */}
            {actionType === "delete" ? (
              <div>
                <p className="mb-4">
                  Are you sure you want to delete {selectedHorse?.name}? This
                  action will completely remove the horse from the system and
                  cannot be undone.
                </p>
              </div>
            ) : actionType === "remove" ? (
              <div>
                <p className="mb-4">
                  Are you sure you want to remove {selectedHorse?.name} from
                  this stable? The horse will remain in the system but will no
                  longer be associated with this stable.
                </p>
                <p className="text-yellow-600 text-sm mb-4">
                  Note: This action will only remove the horse from this stable.
                  It does not delete the horse from the system.
                </p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div>
                  <label
                    htmlFor="horseName"
                    className="block text-sm font-medium mb-1"
                  >
                    Horse Name *
                  </label>
                  <input
                    type="text"
                    id="horseName"
                    name="name"
                    value={horseForm.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    htmlFor="horseBreed"
                    className="block text-sm font-medium mb-1"
                  >
                    Breed
                  </label>
                  <input
                    type="text"
                    id="horseBreed"
                    name="breed"
                    value={horseForm.breed}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="horseColor"
                    className="block text-sm font-medium mb-1"
                  >
                    Color
                  </label>
                  <input
                    type="text"
                    id="horseColor"
                    name="color"
                    value={horseForm.color}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="horseAge"
                    className="block text-sm font-medium mb-1"
                  >
                    Birth Date
                  </label>
                  <input
                    type="date"
                    id="horseAge"
                    name="age"
                    value={horseForm.age}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-xs text-gray mt-1">Format: YYYY-MM-DD</p>
                </div>
              </form>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                type="secondary"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type={
                  actionType === "delete"
                    ? "danger"
                    : actionType === "remove"
                    ? "warning"
                    : "primary"
                }
                onClick={handleSubmit}
                disabled={
                  (actionType === "add" && !horseForm.name) ||
                  (actionType === "edit" && !horseForm.name) ||
                  loading ||
                  actionSuccess // Disable after success
                }
              >
                {loading ? (
                  <LoadingSpinner size="small" className="mx-auto" />
                ) : actionType === "add" ? (
                  "Add Horse"
                ) : actionType === "edit" ? (
                  "Save Changes"
                ) : actionType === "delete" ? (
                  "Delete Horse"
                ) : (
                  "Remove from Stable"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HorseList;
