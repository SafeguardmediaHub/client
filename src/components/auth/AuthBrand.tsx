"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthBrand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3 font-medium">
      <div className="relative">
        <div className="relative flex h-12 w-10 items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/SGM.svg"
            alt=""
            width={231}
            height={315}
            priority
            unoptimized
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
      <div className="leading-tight">
        <p className="font-semibold tracking-tight text-slate-900">
          Safeguardmedia
        </p>
        <p className="text-xs text-slate-500">Technologies</p>
      </div>
    </Link>
  );
}
