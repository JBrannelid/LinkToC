import React from "react";
import NavigationBar from "./NavigationBar";

export default function NavigationFooter() {
  return (
    <nav className="fixed bottom-15 left-0 right-0 z-100  px-4 md:px-8 lg:hidden ">
      <div className="flex items-center justify-center h-full">
        <NavigationBar />
      </div>
    </nav>
  );
}
