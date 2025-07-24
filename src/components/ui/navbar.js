"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductItem } from "@/components/ui/navbar-menu";
import { useRouter } from "next/navigation";
export default function Nav() {
  const router = useRouter();
  
  return (
    <div className="relative w-full flex items-center justify-center border-black">
      <Image
        src="/gitgood-logo_thomasbrigham.png"
        alt="GitGood Logo"
        width={70}
        height={70}
        className="absolute left-2 top-2 rounded-full hover:cursor-pointer z-50"
        onClick={() => router.push("/")}
      />
      <Navbar className="top-2 z-5" />
      <div className="absolute right-5 top-5 rounded-full hover:cursor-pointer z-50">
        <ModeToggle></ModeToggle>
      </div>
      
    </div>
  );
}

function Navbar({
  className
}) {
  const [active, setActive] = useState(null);
  const router = useRouter();
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
        <div className="  text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Issue Finder"
              href="/issue_finder"
              src="/nav/issue_finder.png"
              description="Search for easy Github issues and use AI to help you pick"
            />
            <ProductItem
              title="Readme Viewer"
              href="/readme_viewer"
              src="/nav/README_Viewer.png"
              description="View and make potential edits to readmes from Github "
            />
            <ProductItem
              title="Profile Comparison"
              href="/profile_comparison"
              src="/nav/profile_comp.png"
              description="Compare Github profiles with friends"
            />
          </div>
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



export function ModeToggle() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}