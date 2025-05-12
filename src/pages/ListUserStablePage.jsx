import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useStableManagement } from "../hooks/useStableManagement";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import ModalHeader from "../components/layout/ModalHeader";
import StableInfo from "../components/layout/StableInfo";
import { ROUTES, buildRoute } from "../routes/routeConstants";
import SearchIcon from "../assets/icons/SearchIcon";
import MemberCard from "../components/layout/MemberCard";

const ListUserStablePage = () => {
  const { stableId: urlStableId } = useParams();
  const { currentStable, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // StableId from context or URL params
  const stableId = urlStableId || currentStable?.id;
  const { members, loading, error, loadingState } =
    useStableManagement(stableId);

  // Filter users based on search term
  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    return searchTerm === "" || fullName.includes(searchTerm.toLowerCase());
  });

  const handleProfileClick = (userId) => {
    navigate(buildRoute(ROUTES.USER_PROFILE, { userId }));
  };

  const handleMyProfileClick = () => {
    navigate(buildRoute(ROUTES.USER_PROFILE, { userId: currentUser?.id }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="medium" className="text-gray" />
        <p className="ml-2">{loadingState?.getMessage()}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
      {/* Header */}
      <div className="bg-primary-light lg:bg-background">
        <ModalHeader />
      </div>

      {/* Stable Info */}
      <StableInfo stableId={stableId} />

      {/* Member List */}
      <div className="px-5 py-3 md:px-8 lg:px-16">
        {/* Search Bar */}
        <div className="mb-5 border-t border-b border-gray py-5 lg:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              className="w-full px-10 py-2 border border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <SearchIcon className="w-5 h-5 text-primary" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Profile Btn */}
        <div className="mb-6 flex justify-center">
          <Button
            type="secondary"
            className="w-full max-w-sm"
            onClick={handleMyProfileClick}
          >
            My profile
          </Button>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.userId}
              member={member}
              onClick={() => handleProfileClick(member.userId)}
            />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray">No members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListUserStablePage;
