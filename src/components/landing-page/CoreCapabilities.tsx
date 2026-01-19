'use client';

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Search,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

export default function CoreCapabilities() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const capabilities = [
    {
      title: 'AI-Generated Media Detection',
      description:
        'Detect AI-generated content across video, audio, and images using advanced AI models trained to identify synthetic media patterns.',
      icon: Shield,
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      bgGradient: 'from-blue-50 to-sky-50',
      shadowColor: 'shadow-blue-500/50',
      glowColor: '59, 130, 246', // blue-500 RGB
    },
    {
      title: 'Real-Time Fact-Checking',
      description:
        'Integrate with reputable fact-checking sources and AI-images and Data Check algorithms to verify content authenticity in real-time.',
      icon: Clock,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-50 to-teal-50',
      shadowColor: 'shadow-blue-500/50',
      glowColor: '6, 182, 212', // cyan-500 RGB
    },
    {
      title: 'Visual Authenticity Reports',
      description:
        'Generate comprehensive reports that analyze potential manipulation, metadata analysis, and source verification.',
      icon: BarChart3,
      gradient: 'from-emerald-500 via-green-500 to-lime-500',
      bgGradient: 'from-emerald-50 to-lime-50',
      shadowColor: 'shadow-emerald-500/50',
      glowColor: '16, 185, 129', // emerald-500 RGB
    },
    {
      title: 'Cheapfakes & Shallowfake Detection',
      description:
        'Identifies low-tech edits such as speed manipulation, frame splicing, miscontextualization, and basic editing techniques.',
      icon: Search,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-yellow-50',
      shadowColor: 'shadow-orange-500/50',
      glowColor: '249, 115, 22', // orange-500 RGB
    },
    {
      title: 'Crowdsourced Verification Portal',
      description:
        'Allow verified journalists, fact-checkers, and media professionals to annotate or debunk, and verify content through our platform.',
      icon: CheckCircle,
      gradient: 'from-blue-500 via-indigo-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      shadowColor: 'shadow-blue-500/50',
      glowColor: '99, 102, 241', // indigo-500 RGB
    },
    {
      title: 'Live Detection Tool',
      description:
        'Real-time analysis during live broadcasts, video conferences, and streaming to detect manipulation as it occurs.',
      icon: AlertTriangle,
      gradient: 'from-indigo-500 via-blue-500 to-sky-500',
      bgGradient: 'from-indigo-50 to-sky-50',
      shadowColor: 'shadow-indigo-500/50',
      glowColor: '99, 102, 241', // indigo-500 RGB
    },
    {
      title: 'Metadata and Geolocation Analysis',
      description:
        'Forensics and evidence validation as a CSI-level deep media files to determine the original source and authenticity.',
      icon: BarChart3,
      gradient: 'from-blue-500 via-indigo-500 to-sky-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      shadowColor: 'shadow-blue-500/50',
      glowColor: '59, 130, 246', // blue-500 RGB
    },
    {
      title: 'Risk Scoring System',
      description:
        'Combines multiple analysis results into a single risk score helping decision-makers make a quick assessment.',
      icon: Shield,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      bgGradient: 'from-cyan-50 to-indigo-50',
      shadowColor: 'shadow-cyan-500/50',
      glowColor: '6, 182, 212', // cyan-500 RGB
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
              Core Capabilities
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Powerful Features</span>
            <br />
            <span className="text-gray-900">at a Glance</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These tools are designed to move beyond the initial question of
            authenticity and provide answers to the more profound challenges of
            accuracy and safety.
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
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {capability.description}
                    </p>
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
                  Trusted by 500+ Organizations
                </div>
                <div className="text-sm text-gray-600">
                  Protecting digital integrity worldwide
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
