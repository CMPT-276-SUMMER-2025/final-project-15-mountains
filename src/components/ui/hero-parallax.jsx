"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Button } from "./button";
import Link from "next/link";

export const HeroParallax = ({
  products
}) => {
  const firstRow = products.slice(0, 2);
  const secondRow = products.slice(2, 4);
  const thirdRow = products.slice(4, 6);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0,500]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -500]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);
  
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] ">
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="">
        <motion.div id="herostart" className="flex flex-row space-x space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row space-x space-x-20 mb-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 z-500  flex justify-center">
      <div className="text-center space-y-8 absolute top-0">
        <h1 className="text-gradient font-bold tracking-tight">
          GitGood
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
          GitGood is an AI-powered web app designed to help developers level up their GitHub game. 
          Whether you're a beginner looking for your first open-source issue or a seasoned coder seeking your next contribution, 
          GitGood uses intelligent recommendations to match you with the most relevant GitHub issues based on your skills and interests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="px-8 py-4 text-lg font-medium hover:scale-105 transition-transform duration-200">
            <Link href="/issue_finder">Get Started</Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.scrollBy({ top: 1000, behavior: 'smooth' })} 
            className="px-8 py-4 text-lg font-medium hover:bg-accent transition-colors hover:cursor-pointer"
          >
            Explore Popular Repositories
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        scale: 1.02,
      }}
      key={product.title}
      className="group/product h-96 w-[50rem] relative shrink-0 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0 group-hover/product:scale-110 transition-transform duration-500"
          alt={product.title} />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-300"></div>
      <h2 className="absolute bottom-6 left-6 opacity-0 group-hover/product:opacity-100 text-white text-2xl font-bold transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};
