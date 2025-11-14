"use client";

import {
  AlertTriangle,
  FileTextIcon,
  Info,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisData {
  possibleTampering?: boolean;
  strippedMetadata: boolean;
  missingFields: string[];
  reasons?: string[];
}

interface AnalysisViewProps {
  analysis?: AnalysisData;
}

export function AnalysisView({ analysis }: AnalysisViewProps) {
  console.log(analysis);
  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Analysis Available
          </h3>
          <p className="text-sm text-gray-600">
            This file has not been analyzed yet. Run an analysis to see
            tampering detection results.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isTampered = analysis.possibleTampering || false;
  const reasons = analysis.reasons || [];

  const getTamperingStatus = () => {
    if (isTampered) {
      return {
        icon: AlertTriangle,
        title: "Possible Tampering Detected",
        description: "This file shows signs of manipulation or tampering.",
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    } else {
      return {
        icon: ShieldCheck,
        title: "No Tampering Detected",
        description:
          "This file appears to be authentic with no signs of manipulation.",
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    }
  };

  const status = getTamperingStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card className={`${status.bgColor} ${status.borderColor} border-2`}>
        <CardHeader className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${status.bgColor}`}>
            <StatusIcon className={`w-6 h-6 ${status.color}`} />
          </div>
          <div>
            <CardTitle className={`text-lg ${status.color}`}>
              {status.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{status.description}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Tampered: {isTampered ? "Yes" : "No"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Metadata Stripped: {analysis.strippedMetadata ? "Yes" : "No"}
            </Badge>
            {analysis.missingFields.length > 0 && (
              <Badge variant="outline" className="text-xs">
                Missing Fields: {analysis.missingFields.length}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Results */}
      <div className="grid gap-4">
        {/* Metadata Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Metadata Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Metadata Stripped:</span>
                <Badge
                  variant={
                    analysis.strippedMetadata ? "destructive" : "default"
                  }
                  className="text-xs"
                >
                  {analysis.strippedMetadata ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Missing Fields:</span>
                <Badge variant="outline" className="text-xs">
                  {analysis.missingFields.length} fields
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Missing Fields Details */}
        {analysis.missingFields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Missing Fields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  The following metadata fields are missing or incomplete:
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingFields.map((field) => (
                    <Badge
                      key={field}
                      variant="destructive"
                      className="text-xs"
                    >
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Reasons */}
        {reasons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-gray-500" />
                Analysis Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Overall Status:</span>
              <span
                className={`ml-2 font-medium ${
                  isTampered ? "text-red-600" : "text-green-600"
                }`}
              >
                {isTampered ? "Suspicious" : "Authentic"}
              </span>
            </div>
            <div>
              <span className="font-medium">Metadata Integrity:</span>
              <span className="ml-2 text-gray-700">
                {analysis.strippedMetadata ? "Compromised" : "Intact"}
              </span>
            </div>
            <div>
              <span className="font-medium">Missing Fields:</span>
              <span className="ml-2 text-gray-700">
                {analysis.missingFields.length} fields
              </span>
            </div>
            <div>
              <span className="font-medium">Analysis Reasons:</span>
              <span className="ml-2 text-gray-700">
                {reasons.length} findings
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
