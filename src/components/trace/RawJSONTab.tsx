"use client";

import { Copy, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { TraceResult } from "@/types/trace";

interface RawJSONTabProps {
  data: TraceResult;
}

export const RawJSONTab = ({ data }: RawJSONTabProps) => {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success("JSON copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy JSON");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trace-${data.traceId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON file downloaded");
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-900">Raw Trace Data</h3>
          <p className="text-sm text-gray-600">
            Complete JSON response from the trace API
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="cursor-pointer"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? "Copied!" : "Copy JSON"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
        </div>
      </div>

      {/* JSON Display */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <pre className="text-xs font-mono overflow-x-auto p-4 bg-gray-50 rounded border border-gray-200">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
