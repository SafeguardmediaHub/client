"use client";

import { CopyIcon, FileTextIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetadataGroupProps {
  data: Record<string, string | number | boolean>;
  title?: string;
}

export function MetadataGroup({ data, title }: MetadataGroupProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No {title?.toLowerCase() || "metadata"} available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 text-sm">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-center gap-4 py-1">
          <span className="text-gray-500 font-medium capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}:
          </span>
          <span
            className="text-gray-700 font-mono text-xs max-w-[200px] truncate"
            title={String(value)}
          >
            {String(value) || "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

interface MetadataViewProps {
  metadata?: {
    general?: Record<string, string | number | boolean>;
    video?: Record<string, string | number | boolean>;
    audio?: Record<string, string | number | boolean>;
    exif?: Record<string, string | number | boolean>;
    [key: string]: Record<string, string | number | boolean> | undefined;
  };
}

export function MetadataView({ metadata }: MetadataViewProps) {
  const handleCopyMetadata = () => {
    if (!metadata) return;

    navigator.clipboard
      .writeText(JSON.stringify(metadata, null, 2))
      .then(() => {
        toast.success("Metadata copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy metadata");
      });
  };

  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Metadata Available
          </h3>
          <p className="text-sm text-gray-600">
            Technical metadata has not been extracted for this file yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const metadataSections = [
    { key: "general", title: "General Info", icon: "📄" },
    { key: "video", title: "Video", icon: "🎥" },
    { key: "audio", title: "Audio", icon: "🎵" },
    { key: "exif", title: "EXIF Data", icon: "📷" },
  ];

  // any additional metadata sections that aren't in the predefined list
  const additionalSections = Object.keys(metadata).filter(
    (key) => !metadataSections.some((section) => section.key === key),
  );

  return (
    <div className="space-y-4 px-2">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyMetadata}
          className="flex items-center gap-2"
        >
          <CopyIcon className="w-4 h-4" />
          Copy JSON
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {metadataSections.map((section) => {
          const sectionData = metadata[section.key];
          if (!sectionData || Object.keys(sectionData).length === 0) {
            return null;
          }

          return (
            <AccordionItem key={section.key} value={section.key}>
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Object.keys(sectionData).length} fields
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-4">
                    <MetadataGroup data={sectionData} title={section.title} />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}

        {additionalSections.map((key) => {
          const sectionData = metadata[key];
          if (!sectionData || Object.keys(sectionData).length === 0) {
            return null;
          }

          return (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {Object.keys(sectionData).length} fields
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-4">
                    <MetadataGroup data={sectionData} title={key} />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Metadata Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Sections:</span>
              <span className="ml-2 text-gray-700">
                {Object.keys(metadata).length}
              </span>
            </div>
            <div>
              <span className="font-medium">Total Fields:</span>
              <span className="ml-2 text-gray-700">
                {Object.values(metadata).reduce(
                  (total, section) =>
                    total +
                    (typeof section === "object"
                      ? Object.keys(section).length
                      : 0),
                  0,
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
