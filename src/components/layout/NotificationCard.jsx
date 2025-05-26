import React from "react";
import { getNotificationTypeStyles } from "../../utils/notificationUtils";
import CardBody from "../ui/card/CardBody";
import CardContainer from "../ui/card/CardContainer";
import CardTitle from "../ui/card/CardTitle";

const NotificationCard = ({ notification }) => {
  const { type, title, message, timestamp } = notification;
  const { iconElement } = getNotificationTypeStyles(type);

  return (
    <CardContainer className="mb-3 w-full max-w-2xl mx-auto !border-none !shadow-md">
      <CardBody className="!p-2 ">
        <div className="flex items-start">
          <div className="mr-3 flex-shrink-0">{iconElement}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <CardTitle className="!text-lg !font-medium mb-0 truncate mr-2">
                {title}
              </CardTitle>
              <span className="text-xs text-gray whitespace-nowrap">
                {timestamp}
              </span>
            </div>
            <p className="text-sm mt-1">{message}</p>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default NotificationCard;
