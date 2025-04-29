import React from "react";
import Button from "../../ui/Button";
import PlusIcon from "../../../assets/icons/PlusIcon";

const AddEventButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-25 right-4">
      <Button
        type="primary"
        size="small"
        className="rounded-full w-10 h-10"
        aria-label="Add new event button"
        onClick={onClick}
      >
        <PlusIcon className="h-5 w-6 bg-primary text-white " strokeWidth={3} />
      </Button>
    </div>
  );
};

export default AddEventButton;
