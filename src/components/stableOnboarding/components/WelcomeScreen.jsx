import React from "react";
import Button from "../../ui/Button.jsx";

const WelcomeScreen = ({ onCreateStable, onJoinStable }) => {
  return (
    <div className="space-y-3 flex flex-col items-center">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold mb-2">Welcome to Equilog!</h2>
        <p className="text-gray">
          Let's get started by setting up your stable. You can either create a
          new stable or join an existing one.
        </p>
      </div>
      <Button type="primary" className="w-9/10" onClick={onCreateStable}>
        New stable
      </Button>

      <Button type="secondary" className="w-9/10" onClick={onJoinStable}>
        Search for existing stable
      </Button>
    </div>
  );
};
export default WelcomeScreen;
