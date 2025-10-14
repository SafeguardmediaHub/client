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
                  <AnalysisView analysis={media.analysis} />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
