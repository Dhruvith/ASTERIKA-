"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 top-0 left-0 h-full w-full bg-background flex flex-col items-center justify-center overflow-hidden -z-10",
                className
            )}
        >
            <div className="h-full w-full absolute inset-0 z-0 opacity-30">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 800"
                    className="h-full w-full opacity-[0.2]"
                >
                    <defs>
                        <pattern
                            id="grid-pattern"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M0 40L40 0H20L0 20M40 40V20L20 40"
                                fill="none"
                                stroke="currentColor"
                                strokeOpacity="0.3"
                                className="text-neutral-500"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
            </div>
            <div className="absolute h-full w-full bg-gradient-to-t from-background to-transparent z-10" />
        </div>
    );
};
