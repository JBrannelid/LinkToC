import React from "react";

const UserProfileTabs = ({ activeTab, onChange }) => {
  const tabs = [
    { id: "info", label: "Info" },
    { id: "assignments", label: "Assignments" },
    { id: "horses", label: "Horses" },
  ];

  return (
    <div className="px-6 py-2">
      <div className="flex justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-1 text-lg font-semibold ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-gray"
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserProfileTabs;
