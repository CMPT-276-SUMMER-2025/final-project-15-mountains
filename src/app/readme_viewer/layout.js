import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/ui/navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GitGood - README Viewer",
  description: "AI powered web app to help newcomers to github",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <Nav></Nav>
        {children}
      </body>
    </html>
  );
}
