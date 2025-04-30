import React from "react";
import Button from "../../ui/Button.jsx";

const WelcomeScreen = ({onCreateStable, onJoinStable}) => {
    return (
        <div className="space-y-3">
            <Button
                type="primary"
                className="w-full"
                onClick={onCreateStable}
                >
                New stable
            </Button>
            
            <Button
                type="secondary"
                className="w-full"
                onClick={onJoinStable}>
                
                Search for existing stable
            </Button>
        </div>
    );
};
export default WelcomeScreen;