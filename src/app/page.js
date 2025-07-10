"use client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import React from "react";
export default function Home() {
  return (
  <div className="">
  <Hero></Hero>

  </div>
  );

}
export function Hero() {
  return <HeroParallax products={repos} />;

}
export const repos = [
  {
    title: "React",
    link: "https://github.com/facebook/react",
    thumbnail: "/heropage/react.PNG",
  },
  {
    title: "Next.js",
    link: "https://github.com/vercel/next.js",
    thumbnail: "/heropage/nextjs.PNG",
  },
  {
    title: "Tailwind CSS",
    link: "https://github.com/tailwindlabs/tailwindcss",
    thumbnail: "/heropage/tailwind.PNG",
  },
  {
    title: "Vue.js",
    link: "https://github.com/vuejs/vue",
    thumbnail: "/heropage/vue.PNG",
  },
  {
    title: "Vite",
    link: "https://github.com/vitejs/vite",
    thumbnail: "/heropage/vite.PNG",
  },
  {
    title: "Astro",
    link: "https://github.com/withastro/astro",
    thumbnail: "/heropage/astro.PNG",
  },
  {
    title: "Svelte",
    link: "https://github.com/sveltejs/svelte",
    thumbnail: "/heropage/svelte.PNG",
  },
  {
    title: "Docusaurus",
    link: "https://github.com/facebook/docusaurus",
    thumbnail: "/heropage/docusaurus.PNG",
  },
  {
    title: "Supabase",
    link: "https://github.com/supabase/supabase",
    thumbnail: "/heropage/supabase.PNG",
  },
  {
    title: "ShadCN UI",
    link: "https://github.com/shadcn-ui/ui",
    thumbnail: "/heropage/shadcn.PNG",
  },
  {
    title: "OpenAI Cookbook",
    link: "https://github.com/openai/openai-cookbook",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/10169/10169515.png",
  },
  {
    title: "Electron",
    link: "https://github.com/electron/electron",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/9/91/Electron_Software_Framework_Logo.svg",
  },
];
