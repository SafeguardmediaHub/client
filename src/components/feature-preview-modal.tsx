"use client";

import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FeatureMetadata } from "@/lib/features";

interface FeaturePreviewModalProps {
  feature: FeatureMetadata;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadge = (status: FeatureMetadata["status"]) => {
  switch (status) {
    case "available":
      return {
        label: "Available",
        className: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
      };
    case "beta":
      return {
        label: "Beta",
        className: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Sparkles,
      };
    case "in_development":
      return {
        label: "In Development",
        className: "bg-purple-100 text-purple-700 border-purple-200",
        icon: AlertCircle,
      };
    case "coming_soon":
      return {
        label: "Coming Soon",
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Calendar,
      };
  }
};

export const FeaturePreviewModal = ({
  feature,
  isOpen,
  onClose,
}: FeaturePreviewModalProps) => {
  const [notifyEmail, setNotifyEmail] = useState("");

  if (!isOpen) return null;

  const statusBadge = getStatusBadge(feature.status);
  const StatusIcon = statusBadge.icon;

  const handleNotifyMe = () => {
    // TODO: Implement actual notification signup
    if (!notifyEmail) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    toast.success("You'll be notified when this feature launches!", {
      description: `We'll send updates to ${notifyEmail}`,
    });
    setNotifyEmail("");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 animate-in zoom-in-95 fade-in duration-200">
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="pr-12">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Lock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {feature.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Badge
                  variant="outline"
                  className={cn("border flex items-center gap-1.5", statusBadge.className)}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusBadge.label}
                </Badge>
                {feature.estimatedRelease && (
                  <Badge variant="outline" className="text-xs">
                    ETA: {feature.estimatedRelease}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                About This Feature
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>

            {/* Coming Soon Message */}
            {feature.comingSoonMessage && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      What We're Building
                    </h4>
                    <p className="text-sm text-blue-800">
                      {feature.comingSoonMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            {feature.benefits && feature.benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Key Capabilities
                </h3>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {feature.estimatedRelease && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Expected Launch
                    </div>
                    <div className="text-sm text-gray-600">
                      {feature.estimatedRelease}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notify Me Section */}
            {feature.status === "coming_soon" ||
            feature.status === "in_development" ? (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3 mb-3">
                  <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Get Notified When Available
                    </h4>
                    <p className="text-sm text-gray-600">
                      Be the first to know when {feature.name} launches.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Button
                    onClick={handleNotifyMe}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-500"
                  >
                    Notify Me
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Have questions?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => {
                    toast.info("Contact support feature coming soon!");
                  }}
                >
                  Contact our team
                </button>
              </p>
              <Button
                variant="outline"
                onClick={onClose}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
