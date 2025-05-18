import React from "react";
import { Link } from "react-router";
import { ROUTES, buildRoute } from "../../routes/routeConstants";
import { format } from "date-fns";
import { useAppContext } from "../../context/AppContext";

function DesktopFooter() {
  const currentYear = format(new Date(), "yyyy");
  const { currentUser, currentStable } = useAppContext();

  return (
    <div className="w-full bg-white shadow-md lg:h-16 2xl:h-20">
      <div className="container mx-auto px-7 flex justify-between items-center h-full">
        <div className="flex items-center">
          <p className="lg:text-sm 2xl:text-lg font-normal">
            &copy; {currentYear} All rights reserved
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8">
          <Link
            to={ROUTES.SETTINGS}
            className="text-primary text-sm hover:text-primary "
          >
            Contact
          </Link>
          <Link
            to={ROUTES.SETTINGS}
            className="text-primary text-sm hover:text-primary "
          >
            About
          </Link>
          <Link
            to={buildRoute(ROUTES.STABLE_HORSES, {
              stableId: currentStable?.id,
            })}
            className="text-primary text-sm hover:text-primary "
          >
            Horses
          </Link>
          <Link
            to={buildRoute(ROUTES.STABLE_MEMBERS, {
              stableId: currentStable?.id,
            })}
            className="text-primary text-sm hover:text-primary "
          >
            Members
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DesktopFooter;
