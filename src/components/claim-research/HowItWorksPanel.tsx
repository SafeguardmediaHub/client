"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function HowItWorksPanel() {
  return (
    <Card className="w-full h-full border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-900 dark:text-blue-100">
          <Shield className="w-5 h-5" />
          How Claim Investigation Works
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Claim Decomposition</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your claim is broken down into atomic, verifiable statements
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Source Matching</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Each statement is cross-referenced against verified, authoritative sources
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Conflict Identification</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Contradictions are identified, weighted, and documented with evidence
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Confidence Scoring</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Final confidence reflects evidence quality and consensus, not popularity
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
