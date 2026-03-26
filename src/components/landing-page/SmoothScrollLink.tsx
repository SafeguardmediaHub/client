"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type SmoothScrollLinkProps = ComponentProps<typeof Link> & {
  onNavigate?: () => void;
};

export default function SmoothScrollLink({
  href,
  onClick,
  onNavigate,
  ...props
}: SmoothScrollLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || typeof href !== "string") {
      return;
    }

    if (href.startsWith("#") && pathname === "/") {
      const target = document.querySelector<HTMLElement>(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });

      window.history.pushState(null, "", href);
      onNavigate?.();
      return;
    }

    onNavigate?.();
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
