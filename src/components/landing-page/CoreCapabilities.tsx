'use client';

import {
  CheckCircle,
  FileSearch,
  MapPin,
  MessageSquareText,
  ScanEye,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

export default function CoreCapabilities() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const capabilities = [
    {
      title: 'AI Media Detection',
      description:
        'Analyzes media for signs of AI-generated or synthetically manipulated content, including face swaps and deepfakes.',
      icon: Shield,
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      bgGradient: 'from-blue-50 to-sky-50',
      shadowColor: 'shadow-blue-500/50',
      glowColor: '59, 130, 246', // blue-500 RGB
      comingSoon: true,
      estimatedTime: '30-60 seconds',
    },
    {
      title: 'Claim Research',
      description:
        'Conducts comprehensive web research to verify factual claims by gathering evidence from multiple sources with detailed citations.',
      icon: MessageSquareText,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-50 to-teal-50',
      shadowColor: 'shadow-blue-500/50',
      glowColor: '6, 182, 212', // cyan-500 RGB
      estimatedTime: '45-90 seconds',
    },
    {
      title: 'Visual Tampering Detection',
      description:
        'Analyzes media metadata and properties for signs of manipulation, detecting editing software signatures and inconsistencies.',
      icon: ScanEye,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      bgGradient: 'from-purple-50 to-rose-50',
      shadowColor: 'shadow-purple-500/50',
      glowColor: '168, 85, 247', // purple-500 RGB
      estimatedTime: '5-15 seconds',
    },
    {
      title: 'Reverse Image Lookup',
      description:
        'Searches the web to find earlier appearances of an image online, discovering context and detecting misattributed photos.',
      icon: Search,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      shadowColor: 'shadow-emerald-500/50',
      glowColor: '16, 185, 129', // emerald-500 RGB
      estimatedTime: '15-30 seconds',
    },
    {
      title: 'Geolocation Verification',
      description:
        'Verifies claimed locations by analyzing GPS data, metadata consistency, and assessing GPS signal quality.',
      icon: MapPin,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-yellow-50',
      shadowColor: 'shadow-orange-500/50',
      glowColor: '249, 115, 22', // orange-500 RGB
      estimatedTime: '30-60 seconds',
    },
    {
      title: 'C2PA Content Credentials',
      description:
        'Verifies Content Authenticity Initiative digital signatures and provenance data, essential for identifying AI-generated content.',
      icon: CheckCircle,
      gradient: 'from-blue-500 via-indigo-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      shadowColor: 'shadow-blue-500/50',
      glowColor: '99, 102, 241', // indigo-500 RGB
      estimatedTime: '10-20 seconds',
    },
    {
      title: 'Fact-Check Verification',
      description:
        'Searches authoritative fact-checking databases to verify textual claims against known verdicts from reputable sources.',
      icon: FileSearch,
      gradient: 'from-indigo-500 via-blue-500 to-sky-500',
      bgGradient: 'from-indigo-50 to-sky-50',
      shadowColor: 'shadow-indigo-500/50',
      glowColor: '99, 102, 241', // indigo-500 RGB
      estimatedTime: '20-45 seconds',
    },
    {
      title: 'Timeline Verification',
      description:
        'Verifies media metadata and performs reverse lookup to establish timeline, detecting backdated or misdated content.',
      icon: Sparkles,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      bgGradient: 'from-cyan-50 to-indigo-50',
      shadowColor: 'shadow-cyan-500/50',
      glowColor: '6, 182, 212', // cyan-500 RGB
      estimatedTime: '20-40 seconds',
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full mix-blend-multiply filter blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-full mb-6">
            <span className="text-sm font-semibold text-blue-600">
              Powerful Features
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Comprehensive Tools</span>
            <br />
            <span className="text-gray-900">at a Glance</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From AI detection to fact-checking, our suite of verification tools
            helps you investigate and validate digital content with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((capability, index) => {
            const IconComponent = capability.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={capability.title}
                className="relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${capability.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-75 transition duration-500`}
                />

                {/* Card */}
                <div
                  className={`relative h-full bg-white rounded-3xl p-8 transition-all duration-500 border-2 ${
                    isHovered
                      ? `border-transparent shadow-2xl ${capability.shadowColor} transform -translate-y-2`
                      : 'border-gray-100 shadow-md'
                  }`}
                >
                  {/* Coming Soon Badge */}
                  {capability.comingSoon && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Background Gradient (on hover) */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${capability.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div
                      className={`relative w-20 h-20 mb-6 transition-transform duration-500 ${
                        isHovered ? 'scale-110 rotate-6' : ''
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} rounded-2xl opacity-10 blur-sm`}
                      />
                      <div
                        className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${capability.gradient} p-0.5`}
                      >
                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                          <IconComponent
                            className={`w-10 h-10 bg-gradient-to-br ${
                              capability.gradient
                            } bg-clip-text text-transparent transition-transform duration-500 ${
                              isHovered ? 'scale-110' : ''
                            }`}
                            style={{
                              filter: isHovered
                                ? `drop-shadow(0 0 8px rgba(${capability.glowColor}, 0.6))`
                                : 'none',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <h3
                      className={`text-lg font-bold mb-3 transition-all duration-300 ${
                        isHovered
                          ? `bg-gradient-to-r ${capability.gradient} bg-clip-text text-transparent`
                          : 'text-gray-900'
                      }`}
                    >
                      {capability.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {capability.description}
                    </p>

                    {/* Estimated Time */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <span>{capability.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${capability.gradient} rounded-bl-3xl rounded-tr-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-6 bg-blue-50 rounded-2xl border-2 border-blue-100/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-blue-600">
                  8 Powerful Tools
                </div>
                <div className="text-sm text-gray-600">
                  Comprehensive verification suite
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
