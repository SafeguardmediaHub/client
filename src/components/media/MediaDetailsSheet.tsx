'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Media } from '@/hooks/useMedia';
import { AnalysisView } from './AnalysisView';
import { GeneralInfoView } from './GeneralInfoView';
import { MediaPreview } from './MediaPreview';
import { MetadataView } from './MetadataView';

// const analysisTypes = [
//   {
//     id: 'deepfake',
//     name: 'Deepfake Detection',
//     description: 'Detect AI-generated or manipulated content',
//     icon: ShieldIcon,
//   },
//   {
//     id: 'geolocation',
//     name: 'Geolocation Verification',
//     description:
//       'Verify where the media was captured using metadata and context clues',
//     icon: MapPinIcon,
//   },
//   {
//     id: 'keyframe',
//     name: 'Keyframe Extraction',
//     description: 'Extract significant frames from video for deeper analysis',
//     icon: FilmIcon,
//   },
//   {
//     id: 'reverse-lookup',
//     name: 'Reverse Lookup',
//     description: 'Find matching or similar content across the web',
//     icon: SearchIcon,
//   },
// ];

interface MediaDetailsSheetProps {
  media: Media | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaDetailsSheet({
  media,
  isOpen,
  onOpenChange,
}: MediaDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState('general');

  if (!media) return null;

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto pb-8 px-4">
        <div className="space-y-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {media.filename}
            </SheetTitle>
            <SheetDescription>
              Media file details, metadata, and analysis results
            </SheetDescription>
          </SheetHeader>

          {/* Media Preview */}
          <div className="">
            <MediaPreview media={media} className="-py-6" />
          </div>

          {/* Tabbed Interface */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="general">
                <motion.div
                  key="general"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  <GeneralInfoView media={media} />
                </motion.div>
              </TabsContent>

              <TabsContent value="metadata">
                <motion.div
                  key="metadata"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  <MetadataView metadata={media.metadata} />
                </motion.div>
              </TabsContent>

              <TabsContent value="analysis">
                <motion.div
                  key="analysis"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  <AnalysisView analysis={media.metadata.analysis} />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Analysis Selection */}
        {/* <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Analysis Options</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {analysisTypes.map((analysis) => {
              const IconComponent = analysis.icon;
              const isSelected = selectedAnalysisType === analysis.id;

              return (
                <button
                  key={analysis.id}
                  type="button"
                  className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAnalysisType(analysis.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {analysis.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          isSelected ? 'text-blue-700' : 'text-gray-600'
                        }`}
                      >
                        {analysis.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleAnalysisStart}
              disabled={!selectedAnalysisType}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ZapIcon className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        </div> */}
      </SheetContent>
    </Sheet>
  );
}
