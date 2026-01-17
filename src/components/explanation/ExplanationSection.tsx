import {
  BookOpen,
  FileSearch,
  Lightbulb,
  ShieldAlert,
  Target,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ExplanationSection as IExplanationSection } from "@/types/explanation";

interface ExplanationSectionProps {
  section: IExplanationSection;
}

export function ExplanationSection({ section }: ExplanationSectionProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "evidence":
        return <FileSearch className="h-4 w-4 text-blue-500" />;
      case "interpretation":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "methodology":
        return <Target className="h-4 w-4 text-purple-500" />;
      case "limitation":
        return <ShieldAlert className="h-4 w-4 text-orange-500" />;
      case "recommendation":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      default:
        return <FileSearch className="h-4 w-4" />;
    }
  };

  return (
    <AccordionItem value={`item-${section.order}`}>
      <AccordionTrigger className="text-base font-semibold">
        <div className="flex items-center gap-2">
          {getIcon(section.type)}
          <span>{section.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown>{section.content}</ReactMarkdown>
      </AccordionContent>
    </AccordionItem>
  );
}
