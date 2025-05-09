import React from "react";
import NavigationBar from "./NavigationBar";

export default function NavigationFooter() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-100 h-16 shadow-md px-4 md:px-8 lg:hidden">
      <NavigationBar />
    </nav>
  );
}
