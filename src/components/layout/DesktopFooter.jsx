import { format } from "date-fns";
import React from "react";
import { Link } from "react-router";
import { ROUTES } from "../../routes/index.jsx";

function DesktopFooter() {
  const currentYear = format(new Date(), "yyyy");

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
            to={ROUTES.SETTINGS}
            className="text-primary text-sm hover:text-primary "
          >
            Terms of service
          </Link>
          <Link
            to={ROUTES.SETTINGS}
            className="text-primary text-sm hover:text-primary "
          >
            Privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DesktopFooter;
