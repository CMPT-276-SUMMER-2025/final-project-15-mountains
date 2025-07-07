"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

export default function Nav() {
  return (
    <div className="relative w-full flex items-center justify-center border-black">
      <Navbar className="top-2 dark" />
    </div>
  );
}

function Navbar({
  className
}) {
  const [active, setActive] = useState(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <HoveredLink href="/">Home</HoveredLink>
          

        <MenuItem setActive={setActive} active={active} item="AI Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/markdown_generator">Markdown generator</HoveredLink>
            <HoveredLink href="/chatbot">Chatbot</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Github Services">
        <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/issue_finder">Issue Finder</HoveredLink>
            <HoveredLink href="/profile_comparison">Profile Comparison</HoveredLink>
            <HoveredLink href="/readme_viewer">Readme viewer</HoveredLink>
          </div>

        </MenuItem>
        
      </Menu>
    </div>
  );
}



