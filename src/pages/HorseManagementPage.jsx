import React from "react";
import ModalHeader from "../components/layout/ModalHeader";
import { useAppContext } from "../context/AppContext";
import PermissionGate from "../components/settings/PermissionGate";
import Button from "../components/ui/Button";
import { USER_ROLES } from "../utils/userUtils";
import StableHorseList from "../components/settings/StableHorseList.jsx";


const HorseManagementPage = () => {
    const { currentStable, currentUser } = useAppContext();
    
    const handleGoBack = () => {
        window.history.back();
    };
    
    return (
        <PermissionGate requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
            <div className="flex flex-col min-h-screen bg-background pb-20 overflow-y-hidden">
                <div className="bg-primary-light lg:bg-background">
                    <ModalHeader
                        title="Manage Horses"
                        showCloseBtn={false}
                        onCloseClick={() => window.history.back()}
                    />
                </div>
                <div className="flex-1 px-4 py-6 md:px-8 lg:px-16 xl:px-80 ">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <StableHorseList stableId={currentStable?.id} userId={currentUser?.id} />

                        {/* Desktop back button - only visible on lg screens */}
                        <div className="hidden lg:flex justify-start">
                            <Button
                                type="secondary"
                                onClick={handleGoBack}
                                className="w-auto"
                            >
                                Go back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </PermissionGate>
    )
};

export default HorseManagementPage;