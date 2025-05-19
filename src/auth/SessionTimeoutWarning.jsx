import React from "react";
import Button from "../components/ui/Button";

const SessionTimeoutWarning = ({ onExtend, onLogout }) => {
  return (
    <div
      className="fixed bottom-4 right-4 bg-amber-50 border border-amber-300 rounded-lg shadow-lg p-4 max-w-md z-50"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex  items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 bg-warning-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            Session Warning
          </h3>
          <div className=" mt-2 text-sm text-amber-700">
            <p>
              Your session will expire in 5 minutes. If you do not extend it.
            </p>
          </div>
          <div className="mt-4 flex space-x-3">
            <Button
              type="primary"
              size="small"
              onClick={onExtend}
              aria-label="Extenden session"
            >
              Extend Session
            </Button>
            <Button
              type="secondary"
              size="small"
              onClick={onLogout}
              aria-label="Log Out"
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;
