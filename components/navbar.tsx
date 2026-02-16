"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LogoutButton from "./logout-button";

const Navbar = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={`
        relative
        h-screen
        border-r
        bg-background
        flex flex-col
        items-center
        transition-all duration-300
        ${collapsed ? "w-12" : "w-64"}
      `}
    >
      {/* Toggle Button */}
      <div
        className="absolute -right-3 top-6"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Button
          size="icon"
          variant="secondary"
          className="rounded-xl shadow-md"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
      {/* Logo Container */}
      <div className="flex flex-1 items-center justify-center">
        <Image
          src="/champion.png"
          alt="Champion Logo"
          width={200}
          height={200}
          className={`
            transition-all duration-300
            ${collapsed ? "-rotate-90 w-80 h-3.5" : "rotate-0 w-40 h-auto"}
          `}
          priority
        />
      </div>

      <div className="flex items-center justify-end w-full px-4 py-3 pb-6 pr-6">
        <div className="relative group flex items-center">
          {/* Hover Text */}
          <span
            className="
        absolute right-8
        opacity-0 translate-x-2
        group-hover:opacity-100 group-hover:translate-x-0
        transition-all duration-200
        text-sm font-medium text-[#A3162E]
        pointer-events-none
      "
          >
            Logout
          </span>

          {/* Icon */}
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
