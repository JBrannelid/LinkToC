import React, { useState } from "react";
import {
  getHorseProfileImageUrl,
  formatHorseAge,
} from "../../../utils/horseProfileUtils";
import Button from "../../ui/Button";
import PenIcon from "../../../assets/icons/PenIcon";
import EditInformationModal from "../../layout/EditInformationModal";

const HorseProfileHeader = ({ horse, horseProfile, forceRefresh }) => {
  const [editModal, setEditModal] = useState({
    isOpen: false,
    field: "",
    label: "",
    value: "",
    multiline: false,
  });

  const enhancedHorse = horseProfile?.horse || horse;
  const horseName = enhancedHorse.name || "Unnamed Horse";
  const horseImageUrl = getHorseProfileImageUrl(enhancedHorse);
  const horseColor = enhancedHorse.color || "Unknown color";
  const horseAge = formatHorseAge(enhancedHorse.age);
  const horseBreed = enhancedHorse.breed || "Unknown breed";
  const stablePlace =
    enhancedHorse.currentBox || enhancedHorse.stablePlace || "";
  const weight = enhancedHorse.weight || "";
  const height = enhancedHorse.height || "";

  const openEditModal = (field, label, value, multiline = false) => {
    setEditModal({
      isOpen: true,
      field,
      label,
      value,
      multiline,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      field: "",
      label: "",
      value: "",
      multiline: false,
    });
  };

  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block lg:px-40 xl:px-60 pt-8">
        <div className="flex justify-between items-start">
          {/* Horse info */}
          <div className="flex flex-col relative group">
            <h1 className="text-3xl font-heading font-semibold">
              {horseName}
              <button
                className="absolute right-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() =>
                  openEditModal("name", "Horse Name", enhancedHorse.name || "")
                }
              >
                <PenIcon className="w-5 h-5 text-primary" />
              </button>
            </h1>
            <p className="text-sm text-gray">{horseAge}</p>
            <p className="text-sm text-gray">{horseBreed}</p>
            <p className="text-sm text-gray">{horseColor}</p>
          </div>

          {/* Horse stats buttons */}
          <div className="flex flex-row gap-2 mr-5 mt-10">
            <div className="relative group">
              <Button
                type="secondary"
                className="rounded-lg !border-primary flex flex-col max-h-15"
                aria-label="Stable Place"
              >
                <span className="text-primary mb-1">Box</span>
                <span className="text-xs">{stablePlace}</span>
              </Button>
              <button
                className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1"
                onClick={() =>
                  openEditModal(
                    "currentBox",
                    "Box Number",
                    enhancedHorse.currentBox || enhancedHorse.stablePlace || ""
                  )
                }
              >
                <PenIcon className="w-3 h-3 text-primary" />
              </button>
            </div>

            <div className="relative group">
              <Button
                type="secondary"
                className="rounded-lg !border-primary flex flex-col max-h-15"
                aria-label="Weight"
              >
                <span className="text-primary mb-1">Weight</span>
                <span className="text-xs">{weight}</span>
              </Button>
              <button
                className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1"
                onClick={() =>
                  openEditModal("weight", "Weight", enhancedHorse.weight || "")
                }
              >
                <PenIcon className="w-3 h-3 text-primary" />
              </button>
            </div>

            <div className="relative group">
              <Button
                type="secondary"
                className="rounded-lg !border-primary flex flex-col max-h-15"
                aria-label="Height"
              >
                <span className="text-primary mb-1">Height</span>
                <span className="text-xs">{height}</span>
              </Button>
              <button
                className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1"
                onClick={() =>
                  openEditModal("height", "Height", enhancedHorse.height || "")
                }
              >
                <PenIcon className="w-3 h-3 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Image carousel */}
        <div className="relative mt-4 border-2 border-primary rounded-lg overflow-hidden">
          <div className="w-full h-55 relative">
            <img
              src={horseImageUrl}
              alt={`Image of ${horseName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden relative">
        {/* Horse image */}
        <div className="w-full sm:h-100 h-90 md:h-130">
          <img
            src={horseImageUrl}
            alt={`Image of ${horseName}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Horse info */}
        <div className="px-4 sm:px-6 md:px-8 py-6 bg-background rounded-t-3xl -mt-8 relative z-10">
          <div className="flex flex-col gap-1 relative group">
            <h1 className="text-3xl font-heading font-semibold pr-8">
              {horseName}
              <button
                className="absolute right-0 top-2 transition-opacity"
                onClick={() =>
                  openEditModal("name", "Horse Name", enhancedHorse.name || "")
                }
              >
                <PenIcon className="w-5 h-5 text-primary" />
              </button>
            </h1>
            <p className="text-sm text-gray">{horseAge}</p>
            <p className="text-sm text-gray">{horseBreed}</p>
            <p className="text-sm text-gray">{horseColor}</p>
          </div>

          <div className="flex justify-start gap-2 mt-6 md:justify-center md:px-20">
            {/* Mobile buttons */}
            <div className="flex flex-col items-center w-full md:w-9/10 relative group">
              <Button
                type="secondary"
                className="w-full h-15 md:h-17 !bg-primary-light !border-primary rounded-xl"
                aria-label="Stable Place"
              >
                <div className="flex flex-col items-center w-full">
                  <p className="text-primary">Box</p>
                  <p className="mt-1 text-sm text-center">{stablePlace}</p>
                </div>
              </Button>

              <button
                className="absolute -right-1 -top-1 transition-opacity bg-white rounded-full p-1"
                onClick={() =>
                  openEditModal(
                    "currentBox",
                    "Box Number",
                    enhancedHorse.currentBox || enhancedHorse.stablePlace || ""
                  )
                }
              >
                <PenIcon className="w-5 h-5 text-primary" />
              </button>
            </div>

            <div className="flex flex-col items-center w-full md:w-9/10 relative group">
              <Button
                type="secondary"
                className="w-full h-15 md:h-17 !bg-primary-light !border-primary rounded-xl"
                aria-label="Weight"
              >
                <div className="flex flex-col items-center w-full">
                  <p className="text-primary">Weight</p>
                  <p className="mt-1 text-sm text-center">{weight}kg</p>
                </div>
              </Button>

              <button
                className="absolute -right-1 -top-1 transition-opacity bg-white rounded-full p-1"
                onClick={() =>
                  openEditModal("weight", "Weight", enhancedHorse.weight || "")
                }
              >
                <PenIcon className="w-5 h-5 text-primary" />
              </button>
            </div>

            <div className="flex flex-col items-center w-full md:w-9/10 relative group">
              <Button
                type="secondary"
                className="w-full h-15 md:h-17 !bg-primary-light !border-primary rounded-xl"
                aria-label="Height"
              >
                <div className="flex flex-col items-center w-full">
                  <p className="text-primary">Height</p>
                  <p className="mt-1 text-sm text-center"> {height}cm</p>
                </div>
              </Button>

              <button
                className="absolute -right-1 -top-1 transition-opacity bg-white rounded-full p-1"
                onClick={() =>
                  openEditModal("height", "Height", enhancedHorse.height || "")
                }
              >
                <PenIcon className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditInformationModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        fieldName={editModal.field}
        fieldLabel={editModal.label}
        initialValue={editModal.value}
        userId={enhancedHorse?.id}
        multiline={editModal.multiline}
        userData={enhancedHorse}
        refreshUserData={forceRefresh}
        isHorse={true}
      />
    </>
  );
};

export default HorseProfileHeader;
