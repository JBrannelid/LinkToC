import React from "react";
import Button from "../ui/Button.jsx";
import SettingIcon from "../../assets/icons/SettingIcon.jsx"

const WelcomeScreen = ({onCreateStable, onJoinStable}) => {
    return (
        <div  className="flex flex-col items-center min-h-screen"
              role="region"
              aria-labelledby="welcome-heading">
            
            <div className="self-start mb-2 sm:mb-4">
                <SettingIcon strokeWidth={9} className="w-6 h-6 sm:w-7 sm:h-7 text-primary" aria-hidden="true" />
            </div>
            
            <h1 id="welcome-heading" className="text2-xl sm:text-3xl text-center my-4 sm:my-6 font-heading">EQUILOQ</h1>
            
            <div className="w-full my-2 sm:my-4 px-2 sm:px-4">
                <div className="relative">
                    <img 
                        src="/src/assets/images/FirstLoginImage.jpg" 
                        alt="Häst i hage"
                    className="w-full rounded-lg border border-primary"
                    />
                </div>
            </div>
            <div className="w-full mt-6 sm:mt-8 space-y-3 sm:space-y-4 px-2 sm:px-4">
                <Button
                    type="primary"
                    className="w-full"
                    onClick={onCreateStable}
                >
                    Nytt stall
                </Button>                
                <Button
                    type="secondary"
                    className="w-full"
                    onClick={onJoinStable}
                >
                    Sök efter befintligt stall
                </Button>
                
            </div>
        </div>
    );
};
export default WelcomeScreen;