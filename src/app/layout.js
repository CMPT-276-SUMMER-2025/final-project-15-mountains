import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "GitGood - AI-Powered GitHub Assistant",
  description: "AI powered web app to help newcomers to GitHub with intelligent issue recommendations and development tools",
  keywords: "GitHub, AI, open source, development, issues, markdown, chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen`}
      >
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative">
            <Nav />
            <main className="pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </NextThemesProvider>
      </body>
    </html>
  );
}
