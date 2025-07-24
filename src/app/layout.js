import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { ThemeProvider as NextThemesProvider } from "next-themes";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GitGood",
  description: "AI powered web app to help newcomers to github",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          {children}
          <Footer></Footer>
        </NextThemesProvider>
      </body>
    </html>
  );
}
