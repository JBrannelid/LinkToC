import React from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useUserStables } from "../hooks/useUserStables";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routeConstants";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Card from "../components/ui/card";
import Button from "../components/ui/Button";
import ModalHeader from "../components/layout/ModalHeader";
import StableIcon from "../assets/icons/StableIcon";

const StableSelectionPage = () => {
  const { changeStable } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stables, loading, error, loadingState } = useUserStables();

  const handleSelectStable = (stable) => {
    changeStable(stable.id, stable.name);
    navigate(ROUTES.HOME);
  };

  const handleCreateStable = () => {
    navigate(ROUTES.STABLE_ONBOARDING);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <LoadingSpinner size="large" className="text-primary mb-4" />
        <p className="text-gray-600">{loadingState.getMessage()}</p>
      </div>
    );
  }

  const userFullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : "Unknown User";

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
      {/* Header */}
      <div className="bg-primary-light">
        <ModalHeader title="Select Stable" showCloseBtn={false} />
      </div>

      <div className="px-4 py-6 md:py-12 md:px-8 lg:px-16 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl mb-2">Welcome {userFullName}!</h2>
          <p className="text-gray">
            Select which stable you want to work with today, or{" "}
            <span
              className="text-primary cursor-pointer hover:underline font-semibold"
              onClick={handleCreateStable}
            >
              create a new one
            </span>
          </p>
        </div>

        {/* Stables grid from card grid cointainer */}
        {stables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stables.map((stable) => (
              <Card.Container
                key={stable.id}
                className="cursor-pointer"
                onClick={() => handleSelectStable(stable)}
              >
                <Card.Body className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mr-4">
                      <StableIcon className="w-8 h-8 text-primary" />
                    </div>
                    {/* Stable name and typ headings */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {stable.name || "Unknown stable name"}{" "}
                      </h3>
                      <p className="text-sm ">
                        {stable.type || "Unknown stable type"}
                      </p>
                    </div>
                  </div>

                  {/*  Role and stable county */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your role:</span>
                      <span className="font-medium text-primary">
                        {getRoleName(stable.userRole)}
                      </span>
                    </div>
                    {stable.county && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stable county:</span>
                        <span className="font-medium">{stable.county}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="primary"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStable(stable);
                    }}
                  >
                    Select this stable
                  </Button>
                </Card.Body>
              </Card.Container>
            ))}
          </div>
        ) : (
          // No stables available - display message
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <StableIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              You don't have any stables yet
            </h3>
            <p className=" mb-6">
              Create a new stable or wait for an invitation
            </p>
            <Button
              type="primary"
              onClick={handleCreateStable}
              className="px-8"
            >
              Create new stable
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get role name
const getRoleName = (role) => {
  switch (role) {
    case 0:
      return "Owner";
    case 1:
      return "Admin";
    case 2:
      return "Member";
    default:
      return "Member";
  }
};

export default StableSelectionPage;
