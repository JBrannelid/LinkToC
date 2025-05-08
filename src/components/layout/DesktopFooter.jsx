import React from "react";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routeConstants";
import { format } from "date-fns";

function DesktopFooter() {
  const currentYear = format(new Date(), "yyyy");

  return (
    <div className=" w-full bg-white shadow-md py-6">
      <div className=" mx-auto px-10">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <p className="text-gray text-sm">
              &copy; {currentYear} All rights reserved
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8">
            <Link
              to={ROUTES.SETTINGS}
              className="text-gray text-sm hover:text-primary "
            >
              About
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              className="text-gray text-sm hover:text-primary "
            >
              Terms of Service
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              className="text-gray text-sm hover:text-primary "
            >
              Support
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              className="text-gray text-sm hover:text-primary "
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopFooter;
