import React from "react";
import Button from "../../ui/Button";
import PlusIcon from "../../../assets/icons/PlusIcon";

const AddEventButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-24 right-4 md:static md:mt-1 md:flex md:justify-end">
      <Button
        type="primary"
        variant="icon"
        size="medium"
        className="!bg-primary !rounded-full"
        aria-label="Add new event button"
        onClick={onClick}
      >
        <PlusIcon className="h-6 w-6 text-white" strokeWidth={3} />
      </Button>
    </div>
  );
};

export default AddEventButton;
