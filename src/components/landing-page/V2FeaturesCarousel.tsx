'use client';

import { Bot, Code2, ScanEye, Sparkles, Users, Zap } from 'lucide-react';
import { Card, Carousel } from '@/components/ui/apple-cards-carousel';

const v2Features = [
  {
    category: 'Coming in V2',
    title: 'AI Media Detection',
    src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(190,95%,45%)] rounded-xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Media Detection
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by Advanced Machine Learning
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Advanced AI models trained to detect synthetic media across video,
          audio, and images with industry-leading accuracy. Our detection system
          analyzes subtle patterns and artifacts that are invisible to the human
          eye.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              98%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Accuracy Rate
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              &lt;2s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Analysis Time
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: 'Coming in V2',
    title: 'Visual Forensics',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[hsl(35,85%,60%)] to-[hsl(35,85%,50%)] rounded-xl">
            <ScanEye className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Visual Forensics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Deep Image & Video Analysis
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Deep forensic analysis of images and videos to detect manipulation,
          editing artifacts, and authenticity markers. We examine EXIF data,
          compression patterns, and pixel-level inconsistencies.
        </p>
        <ul className="space-y-2 mt-6">
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            Metadata extraction and verification
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            Clone detection and copy-move analysis
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            Compression artifact identification
          </li>
        </ul>
      </div>
    ),
  },
  {
    category: 'Coming in V2',
    title: 'Audio Forensics',
    src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2940&auto=format&fit=crop',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(35,85%,60%)] rounded-xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Audio Forensics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Voice Clone & Deepfake Detection
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Sophisticated audio analysis to identify voice cloning, audio
          deepfakes, and sound manipulation techniques. Our algorithms detect
          unnatural speech patterns and synthetic voice characteristics.
        </p>
        <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl mt-6">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Detection Capabilities:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-generated voices, spliced audio, pitch manipulation, background
            noise inconsistencies, and temporal anomalies.
          </p>
        </div>
      </div>
    ),
  },
  {
    category: 'Coming in V2',
    title: 'Frame Level Analysis',
    src: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2940&auto=format&fit=crop',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[hsl(220,40%,50%)] to-[hsl(220,40%,40%)] rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Frame Level Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Granular Video Examination
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Granular frame-by-frame examination of video content to detect subtle
          edits and temporal inconsistencies. Every frame is analyzed for
          manipulation markers and continuity breaks.
        </p>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              60fps
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Analysis Speed
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              4K
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Max Resolution
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ∞
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Video Length
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: 'Coming in V2',
    title: 'Organization Support',
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[hsl(35,85%,60%)] to-[hsl(190,95%,55%)] rounded-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Organization Support
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enterprise-Grade Team Features
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Enterprise-grade features including team management, role-based
          access, and collaborative verification workflows. Perfect for
          newsrooms, research teams, and content moderation departments.
        </p>
        <div className="space-y-3 mt-6">
          <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Team Workspaces
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Shared projects and collaborative investigations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Role-Based Access
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Granular permissions and access control
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: 'Coming in V2',
    title: 'Developer API Access',
    src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2940&auto=format&fit=crop',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(220,40%,50%)] rounded-xl">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Developer API Access
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              RESTful API Integration
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          RESTful API with comprehensive documentation for integrating
          Safeguardmedia into your applications and workflows. Build custom
          solutions with our powerful verification engine.
        </p>
        <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 mt-6 font-mono text-sm">
          <div className="text-green-400 mb-2">{'//'} Example API Request</div>
          <div className="text-gray-300">
            <span className="text-purple-400">POST</span>{' '}
            <span className="text-blue-400">/api/v2/verify</span>
          </div>
          <div className="text-gray-500 mt-2">{'{'}</div>
          <div className="text-gray-300 ml-4">
            <span className="text-yellow-400">"media_url"</span>:{' '}
            <span className="text-green-400">"https://..."</span>,
          </div>
          <div className="text-gray-300 ml-4">
            <span className="text-yellow-400">"analysis_type"</span>:{' '}
            <span className="text-green-400">"comprehensive"</span>
          </div>
          <div className="text-gray-500">{'}'}</div>
        </div>
      </div>
    ),
  },
];

export default function V2FeaturesCarousel() {
  const cards = v2Features.map((feature, index) => (
    <Card key={feature.title} card={feature} index={index} />
  ));

  return (
    <section className="relative py-32 overflow-hidden bg-[hsl(40,40%,95%)]">
      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      {/* Diagonal Accent */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[hsl(190,95%,55%)]/5 to-transparent transform -skew-x-12 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(35,85%,60%)]/10 to-[hsl(35,85%,50%)]/10 border border-[hsl(35,85%,60%)]/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[hsl(35,85%,60%)]" />
            <span className="text-sm font-bold text-[hsl(35,85%,60%)] uppercase tracking-wider">
              Coming in V2
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-[hsl(220,40%,15%)] mb-6 leading-tight">
            What's Coming Next
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powerful new features coming in Version 2.0 to revolutionize how you
            verify and protect digital content.
          </p>
        </div>

        {/* Apple Cards Carousel */}
        <Carousel items={cards} />
      </div>
    </section>
  );
}
