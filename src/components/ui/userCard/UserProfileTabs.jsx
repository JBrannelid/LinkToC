import React from "react";

const UserProfileTabs = ({ activeTab, onChange }) => {
  return (
    <div className="px-1 md:px-6 py-2 mb-4">
      <div className="flex justify-evenly px-0 sm:px-10 md:px-20">
        <button
          className={`px-4 py-1 text-lg lg:text-xl lg:py-2 font-semibold ${
            activeTab === "info"
              ? "text-primary border-b-2 border-primary"
              : "text-gray"
          }`}
          onClick={() => onChange("info")}
        >
          About
        </button>
        <button
          className={`px-4 py-1 text-lg lg:text-xl lg:py-2 font-semibold ${
            activeTab === "horses"
              ? "text-primary border-b-2 border-primary"
              : "text-gray"
          }`}
          onClick={() => onChange("horses")}
        >
          Horses
        </button>
      </div>
    </div>
  );
};

export default UserProfileTabs;
