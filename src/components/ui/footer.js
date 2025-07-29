"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith("/chatbot");
  
  return (
    <>
    {!hideFooter && (
      <footer className="bg-card border-t border-border/50 mt-20">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-12 lg:py-16">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <Image
                  alt="GitGood Logo"
                  width={50}
                  height={50}
                  src="/gitgood-logo_thomasbrigham.png"
                  className="rounded-full group-hover:scale-105 transition-transform duration-200"
                />
                <span className="self-center text-2xl font-bold text-gradient">
                  GitGood
                </span>
              </Link>
              <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
                Empowering developers to contribute to open source with AI-powered tools and intelligent recommendations.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
                  AI Services
                </h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li>
                    <Link href="/markdown_editor" className="hover:text-primary transition-colors">
                      Markdown Editor
                    </Link>
                  </li>
                  <li>
                    <Link href="/chatbot" className="hover:text-primary transition-colors">
                      Chatbot
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
                  GitHub Services
                </h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li>
                    <Link href="/issue_finder" className="hover:text-primary transition-colors">
                      Issue Finder
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile_comparison" className="hover:text-primary transition-colors">
                      Profile Comparison
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
                  Other
                </h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-primary transition-colors">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="my-8 border-border/50" />

          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground sm:text-center">
              © 2025{" "}
              <Link href="/" className="hover:text-primary transition-colors font-medium">
                GitGood™
              </Link>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-6">

            </div>
          </div>
        </div>
      </footer>
    )}
    </>
  );
}
