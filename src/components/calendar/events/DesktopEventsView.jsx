import React from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";
import { formatTimeOnly } from "../../../utils/calendarUtils";
import CloseIcon from "../../../assets/icons/CloseIcon";

const DesktopEventsView = ({
  selectedDay,
  events = [],
  format,
  locale,
  noEventsMessage,
  onUpdateEvent,
  onAddEvent,
  onBackToWall,
}) => {
  // Format day header date
  const formattedDate = format(selectedDay, "EEEE, MMMM d", { locale });

  return (
    <div className="mt-10 h-full">
      <div className="bg-white rounded-lg shadow-md p-10 h-full flex flex-col">
        {/* Header with date and close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading text-xl font-normal">{formattedDate}</h2>
          {onBackToWall && (
            <Button
              type="icon"
              onClick={onBackToWall}
              className="text-primary"
              aria-label="Close"
            >
              <CloseIcon size={30} strokeWidth={2} className="text-primary" />
            </Button>
          )}
        </div>

        {/* Event list */}
        <div className="flex-1 overflow-y-auto pr-1">
          {events.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray">{noEventsMessage}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="relative cursor-pointer mb-3"
                  onClick={() => onUpdateEvent(event.id)}
                >
                  {/* List background - gray colors */}
                  <div className="absolute top-0 left-5 right-0 h-13 bg-background/80 rounded-tr-lg rounded-br-lg z-0"></div>

                  <div className="relative z-10 flex items-center">
                    {/* Profile image */}
                    <div className="flex-shrink-0 mr-2 z-20">
                      <div className="w-14 h-14 rounded-full border-1 border-primary overflow-hidden flex items-center justify-center bg-white">
                        <img
                          src="/src/assets/images/userPlaceholder.jpg"
                          alt={`${event.user.firstName} ${event.user.lastName} || "User"} profile image`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Event details */}
                    <div className="flex flex-1 justify-between items-center px-4 py-2 ml-0">
                      <div>
                        <h3 className="font-heading text-lg font-normal leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-primary text-xs">
                          {event.user
                            ? `${event.user.firstName} ${event.user.lastName}`.trim()
                            : "Unknown user"}
                        </p>
                      </div>

                      {/* Time */}
                      <div className="flex-shrink-0">
                        <div className="bg-white border border-primary rounded-lg px-2 py-1 text-sm">
                          kl: {formatTimeOnly(event.startDateTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add new event button */}
        <div className="flex justify-end items-center mt-2">
          <Button
            type="primary"
            variant="icon"
            size="small"
            className="!bg-primary !rounded-full shadow-md"
            aria-label="Add new event"
            onClick={onAddEvent}
          >
            <CloseIcon
              size={16}
              strokeWidth={2}
              className="text-white transform rotate-45"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesktopEventsView;
