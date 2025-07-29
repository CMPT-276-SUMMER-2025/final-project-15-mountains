"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SearchIcon, GraphIcon, DependabotIcon, PencilIcon } from "@primer/octicons-react";

export default function Nav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="flex items-center justify-between h-16">
          
          
          <div className="flex-shrink-0 flex flex-row">
            <Image
              src="/gitgood-logo_thomasbrigham.png"
              alt="GitGood Logo"
              width={40}
              height={40}
              className="hover:cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => router.push("/")}
            />
          </div>

          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              
              <div className="relative group">
                <button className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  AI Services
                </button>
                <div className="absolute left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 grid grid-cols-1 gap-4">
                    <Link 
                      href="/markdown_editor" 
                      className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <PencilIcon/>
                      </div>
                      <div>
                        <div className="font-medium">Markdown Editor</div>
                        <div className="text-sm text-muted-foreground">AI-powered markdown editor</div>
                      </div>
                    </Link>
                    <Link 
                      href="/chatbot" 
                      className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <DependabotIcon/>
                      </div>
                      <div>
                        <div className="font-medium">Chatbot</div>
                        <div className="text-sm text-muted-foreground">Get help with development</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  GitHub Services
                </button>
                <div className="absolute left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 grid grid-cols-1 gap-4">
                    <Link 
                      href="/issue_finder" 
                      className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <SearchIcon/>
                      </div>
                      <div>
                        <div className="font-medium">Issue Finder</div>
                        <div className="text-sm text-muted-foreground">Find GitHub issues to work on</div>
                      </div>
                    </Link>
                    <Link 
                      href="/profile_comparison" 
                      className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <GraphIcon/>
                      </div>
                      <div>
                        <div className="font-medium">Profile Comparison</div>
                        <div className="text-sm text-muted-foreground">Compare GitHub profiles</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <Link 
                href="/about" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>

         
          <div className="hidden md:block cursor-pointer ">
            <ModeToggle />
          </div>

          
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

       
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border bg-background/95">
              <Link 
                href="/" 
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <div className="text-foreground px-3 py-2 text-sm font-semibold">AI Services</div>
                <Link 
                  href="/markdown_editor" 
                  className="text-muted-foreground hover:text-primary block px-6 py-2 rounded-md text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Markdown Editor
                </Link>
                <Link 
                  href="/chatbot" 
                  className="text-muted-foreground hover:text-primary block px-6 py-2 rounded-md text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Chatbot
                </Link>
              </div>

              <div className="space-y-2">
                <div className="text-foreground px-3 py-2 text-sm font-semibold">GitHub Services</div>
                <Link 
                  href="/issue_finder" 
                  className="text-muted-foreground hover:text-primary block px-6 py-2 rounded-md text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Issue Finder
                </Link>
                <Link 
                  href="/profile_comparison" 
                  className="text-muted-foreground hover:text-primary block px-6 py-2 rounded-md text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile Comparison
                </Link>
              </div>

              <Link 
                href="/about" 
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function ModeToggle() {
  const { setTheme } = useTheme("system");
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className=" transition-colors hover:cursor-pointer dark:hover:bg-gray-800">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-accent">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-accent">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-accent">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}