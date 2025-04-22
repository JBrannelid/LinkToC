import React from "react";
import { Plus } from "lucide-react";

const AddEventButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-20 right-4">
      <button
        type="button"
        onClick={onClick}
        className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg"
        aria-label="Add new event button"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
};

export default AddEventButton;
