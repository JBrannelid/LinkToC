import React from "react";
import CloseIcon from "../../../assets/icons/CloseIcon";
import { formatTimeOnly } from "../../../utils/calendarUtils";
import ProfileImage from "../../common/ProfileImage";
import Button from "../../ui/Button";

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
    <div className="mt-4 md:mt-10 h-full w-full">
      <div className="bg-white rounded-lg shadow-md p-3 md:p-5 lg:p-10 h-full flex flex-col overflow-hidden">
        {/* Header with date and close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading text-lg md:text-xl font-normal truncate pr-2">
            {formattedDate}
          </h2>
          {onBackToWall && (
            <Button
              type="icon"
              onClick={onBackToWall}
              className="text-primary flex-shrink-0"
              aria-label="Close"
            >
              <CloseIcon
                size={24}
                strokeWidth={2}
                className="text-primary w-5 h-5 md:w-6 md:h-6"
              />
            </Button>
          )}
        </div>

        {/* Event list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {events.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray">{noEventsMessage}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="relative cursor-pointer mb-3 max-w-full"
                  onClick={() => onUpdateEvent(event.id)}
                >
                  {/* List background - gray colors */}
                  <div className="absolute top-0 left-8 sm:left-10 md:left-9 lg:left-5 right-0 h-12 bg-background/80 rounded-tr-lg rounded-br-lg z-0"></div>

                  <div className="relative z-10 flex items-center w-full">
                    {/* Profile image */}
                    <div className="flex-shrink-0 mr-1 md:mr-2 z-20">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 rounded-full border border-primary overflow-hidden flex items-center justify-center bg-white">
                        <ProfileImage
                          user={event.user}
                          className="w-full h-full object-cover"
                          alt={`Profile of ${
                            event.user
                              ? `${event.user.firstName || ""} ${
                                  event.user.lastName || ""
                                }`.trim()
                              : "Unknown user"
                          }`}
                          size="rounded"
                        />
                      </div>
                    </div>

                    {/* Event details */}
                    <div className="flex flex-1 justify-between items-center min-w-0 px-1 sm:px-2 md:px-2 lg:px-3 py-1 md:py-2">
                      <div className="min-w-0 pr-1 flex-1">
                        <h3 className="font-heading text-sm sm:text-base md:text-base lg:text-lg font-normal leading-tight truncate">
                          {event.title}
                        </h3>
                        <p className="text-primary text-xs truncate">
                          {event.user
                            ? `${event.user.firstName || ""} ${
                                event.user.lastName || ""
                              }`.trim()
                            : "Unknown user"}
                        </p>
                      </div>

                      {/* Time */}
                      <div className="flex-shrink-0">
                        <div className="bg-white border border-primary rounded-lg px-1 sm:px-1.5 md:px-2 py-1 text-xs whitespace-nowrap">
                          {formatTimeOnly(event.startDateTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
    </div>
  );
};

export default DesktopEventsView;
