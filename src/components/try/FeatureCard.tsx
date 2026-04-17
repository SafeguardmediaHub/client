import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
}

export function FeatureCard({
  href,
  icon,
  title,
  description,
  tags,
}: FeatureCardProps) {
  return (
    <Link href={href} className="block h-full">
      <div
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/80",
        )}
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600">
          Try now
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
