"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith("/chatbot");
  return (
    <>
    {!hideFooter && <footer className="bg-white dark:bg-black border-t-2">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                alt="GitGood Logo"
                width={70}
                height={70}
                src="/gitgood-logo_thomasbrigham.png"
                className="me-3"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap ">
                GitGood
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold  uppercase ">
                AI Services
              </h2>
              <ul className="  font-medium">
                <li className="mb-4">
                  <Link href="/markdown_editor" className="hover:underline">
                    Markdown Editor
                  </Link>
                </li>
                <li>
                  <Link href="/chatbot" className="hover:underline">
                    Chatbot
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold  uppercase ">
                GitHub Services
              </h2>
              <ul className=" font-medium">
                <li className="mb-4">
                  <Link href="/issue_finder" className="hover:underline">
                    Issue Finder
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/profile_comparison" className="hover:underline">
                    Profile Comparison
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase ">
                Other
              </h2>
              <ul className=" font-medium">
                <li className="mb-4">
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <Link href="/" className="hover:underline">
              GitGood™
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>}
    </>
  );
}
