import React, { useState, useRef, useEffect } from "react";
import { useUserStables } from "../../hooks/useUserStables";
import { useAppContext } from "../../context/AppContext";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useNavigate, useLocation } from "react-router";
import { ROUTES, buildRoute } from "../../routes/routeConstants";
import StableName from "./StableName";
import ChevronDownIcon from "../../assets/icons/ChevronDownIcon";

const StableDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentStable, changeStable } = useAppContext();
  const { stables, loading } = useUserStables();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  //  If user is on a stable-specific route - Stay on that route even if the stable changes
  const handleStableSelect = (stableId, stableName) => {
    changeStable(stableId, stableName);
    setIsOpen(false);

    const currentPath = location.pathname;
    const stableRoutes = [
      ROUTES.STABLE_POST,
      ROUTES.STABLE_HORSES,
      ROUTES.STABLE_MEMBERS,
    ];

    // Check if current route is a stable-specific route
    const matchedRoute = stableRoutes.find((route) => {
      const baseRoute = route.split("/:")[0];
      return currentPath.startsWith(baseRoute);
    });

    if (matchedRoute) {
      const newRoute = buildRoute(matchedRoute, { stableId });
      navigate(newRoute);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger */}
      <Button
        type="transparent"
        className="flex items-center text-primary hover:underline"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <StableName
          currentStableId={currentStable?.id}
          className="!text-[16px] font-semibold text-primary text-base"
        />
        <div className="text-primary ml-2 ">
          <ChevronDownIcon size={15} />
        </div>
      </Button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white">
          <div className="max-h-60 overflow-auto">
            <div className="px-4 py-2 text-sm font-semibold text-gray border-b">
              Stables
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="small" />
              </div>
            ) : (
              <>
                {stables.map((stable) => (
                  <button
                    key={stable.id}
                    className={`w-full text-left px-4 py-2 text-sm rounded-md shadow-lg hover:text-primary ${
                      stable.id === currentStable?.id
                        ? "bg-white text-primary font-semibold"
                        : "bg-white text-gray"
                    }`}
                    onClick={() => handleStableSelect(stable.id, stable.name)}
                  >
                    {stable.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StableDropdown;
