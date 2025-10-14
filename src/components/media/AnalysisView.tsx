'use client';

import {
  AlertTriangle,
  CheckCircle,
  FileTextIcon,
  Info,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisData {
  tampered?: boolean;
  confidence?: number;
  notes?: string[];
  deepfake?: {
    detected: boolean;
    confidence: number;
  };
  metadata?: {
    stripped: boolean;
    inconsistent: boolean;
  };
  compression?: {
    artifacts: boolean;
    quality: string;
  };
  analyzedAt?: string;
  method?: string;
}

interface AnalysisViewProps {
  analysis?: AnalysisData;
}

export function AnalysisView({ analysis }: AnalysisViewProps) {
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

  const isTampered = analysis.tampered || false;
  const confidence = analysis.confidence || 0;
  const notes = analysis.notes || [];

  const getTamperingStatus = () => {
    if (isTampered) {
      return {
        icon: AlertTriangle,
        title: 'Possible Tampering Detected',
        description: 'This file shows signs of manipulation or tampering.',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    } else {
      return {
        icon: ShieldCheck,
        title: 'No Tampering Detected',
        description:
          'This file appears to be authentic with no signs of manipulation.',
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
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
              Tampered: {isTampered ? 'Yes' : 'No'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Confidence: {Math.round(confidence * 100)}%
            </Badge>
            {analysis.metadata?.stripped && (
              <Badge variant="outline" className="text-xs">
                Metadata Stripped: Yes
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Results */}
      <div className="grid gap-4">
        {/* Deepfake Detection */}
        {analysis.deepfake && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                {analysis.deepfake.detected ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                Deepfake Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    AI-Generated Content:
                  </span>
                  <Badge
                    variant={
                      analysis.deepfake.detected ? 'destructive' : 'default'
                    }
                    className="text-xs"
                  >
                    {analysis.deepfake.detected ? 'Detected' : 'Not Detected'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Confidence:</span>
                  <span className="text-sm text-gray-700">
                    {Math.round(analysis.deepfake.confidence * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata Analysis */}
        {analysis.metadata && (
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
                  <span className="text-sm font-medium">
                    Metadata Stripped:
                  </span>
                  <Badge
                    variant={
                      analysis.metadata.stripped ? 'destructive' : 'default'
                    }
                    className="text-xs"
                  >
                    {analysis.metadata.stripped ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Inconsistent Timestamps:
                  </span>
                  <Badge
                    variant={
                      analysis.metadata.inconsistent ? 'destructive' : 'default'
                    }
                    className="text-xs"
                  >
                    {analysis.metadata.inconsistent ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compression Analysis */}
        {analysis.compression && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-500" />
                Compression Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Compression Artifacts:
                  </span>
                  <Badge
                    variant={
                      analysis.compression.artifacts ? 'destructive' : 'default'
                    }
                    className="text-xs"
                  >
                    {analysis.compression.artifacts
                      ? 'Detected'
                      : 'Not Detected'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quality:</span>
                  <Badge variant="outline" className="text-xs">
                    {analysis.compression.quality || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Notes */}
        {notes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-gray-500" />
                Analysis Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {notes.map((note) => (
                  <li key={note}>{note}</li>
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
                  isTampered ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {isTampered ? 'Suspicious' : 'Authentic'}
              </span>
            </div>
            <div>
              <span className="font-medium">Confidence Level:</span>
              <span className="ml-2 text-gray-700">
                {confidence > 0.8
                  ? 'High'
                  : confidence > 0.5
                  ? 'Medium'
                  : 'Low'}
              </span>
            </div>
            <div>
              <span className="font-medium">Analysis Date:</span>
              <span className="ml-2 text-gray-700">
                {analysis.analyzedAt
                  ? new Date(analysis.analyzedAt).toLocaleDateString()
                  : 'Unknown'}
              </span>
            </div>
            <div>
              <span className="font-medium">Analysis Method:</span>
              <span className="ml-2 text-gray-700">
                {analysis.method || 'Standard Detection'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
