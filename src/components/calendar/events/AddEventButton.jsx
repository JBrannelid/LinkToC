import React from "react";
import { Plus } from "lucide-react";
import Button from "../../ui/Button";

const AddEventButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-20 right-4">
      <Button
        type="primary"
        size="small"
        variant="icon"
        className="bg-primary text-white border-0"
        aria-label="Add new event button"
        onClick={onClick}
      >
        <Plus className="h-10 w-10" strokeWidth={3} />
      </Button>
    </div>
  );
};

export default AddEventButton;
