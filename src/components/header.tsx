"use client";

import { Menu, Shield, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import SmoothScrollLink from "@/components/landing-page/SmoothScrollLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import GoogleTranslate from "./GoogleTranslate";

const menuItems = [
  { name: "Platform", href: "#platform" },
  { name: "Workflow", href: "#workflow" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "Roadmap", href: "#roadmap" },
  { name: "Blog", href: "/blog" },
  // { name: "About", href: "/about" },
];

type HeroHeaderProps = {
  variant?: "default" | "compact";
};

export const HeroHeader = ({ variant = "default" }: HeroHeaderProps) => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const isCompact = variant === "compact";
  const shouldShowFloatingShell = isCompact || isScrolled;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto transition-all duration-300",
            isCompact
              ? "mt-1 max-w-5xl px-4 sm:px-6 lg:px-8"
              : "mt-2 max-w-6xl px-6 lg:px-12",
            shouldShowFloatingShell &&
              "bg-background/70 rounded-2xl border shadow-sm backdrop-blur-lg",
            isScrolled && !isCompact && "max-w-4xl lg:px-5",
          )}
        >
          <div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 lg:gap-0",
              isCompact ? "py-2.5 lg:py-3" : "py-3 lg:py-4",
            )}
          >
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2 group"
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-blue-600/50 blur-md transition duration-300 group-hover:bg-blue-500/60" />
                  <div
                    className={cn(
                      "relative flex items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105",
                      isCompact ? "h-9 w-9" : "h-10 w-10",
                    )}
                  >
                    <Shield
                      className={cn(
                        "text-white",
                        isCompact ? "h-[18px] w-[18px]" : "h-5 w-5",
                      )}
                    />
                  </div>
                </div>
                <div className="leading-tight">
                  <p
                    className={cn(
                      "font-semibold tracking-tight text-gray-900",
                      isCompact ? "text-[0.95rem]" : "",
                    )}
                  >
                    Safeguardmedia
                  </p>
                  <p className="text-xs text-slate-500">Technologies</p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <SmoothScrollLink
                      href={item.href}
                      onNavigate={() => setMenuState(false)}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </SmoothScrollLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <SmoothScrollLink
                        href={item.href}
                        onNavigate={() => setMenuState(false)}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </SmoothScrollLink>
                    </li>
                  ))}
                </ul>
              </div>
              <GoogleTranslate className="w-full justify-start lg:w-auto lg:justify-center" />
              {!isAuthenticated && (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={cn(isScrolled && "lg:hidden")}
                  >
                    <Link href="/auth/login">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={cn(
                      "bg-blue-600 hover:bg-blue-700 text-white",
                      isScrolled && "lg:hidden",
                    )}
                  >
                    <Link href="/auth/signup">
                      <span>Get Started</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={cn(
                      "bg-blue-600 hover:bg-blue-700 text-white",
                      isScrolled ? "lg:inline-flex" : "hidden",
                    )}
                  >
                    <Link href="/auth/signup">
                      <span>Get Started</span>
                    </Link>
                  </Button>
                </div>
              )}
              {isAuthenticated && (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button
                    asChild
                    size="sm"
                    className={cn(
                      isScrolled ? "lg:inline-flex" : "lg:inline-flex",
                    )}
                  >
                    <Link href="/dashboard">
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
