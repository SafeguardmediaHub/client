/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
'use client';

import {
  Briefcase,
  Building2,
  GraduationCap,
  Newspaper,
  Scale,
  Shield,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function SecuringChannels() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const channels = [
    {
      title: 'Journalism & News Media',
      description:
        'Verify breaking news, fact-check viral content, and maintain editorial integrity. Our tools help newsrooms combat misinformation and protect their credibility.',
      image:
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2940&auto=format&fit=crop',
      icon: Newspaper,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      stats: 'Trusted by 500+ Newsrooms',
      features: [
        'Real-time claim verification',
        'Source credibility analysis',
        'Tamper detection for images/videos',
      ],
    },
    {
      title: 'Corporate & Enterprise',
      description:
        'Protect your organization from deepfake fraud, impersonation attacks, and synthetic media threats. Secure internal communications and verify external content.',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop',
      icon: Building2,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      stats: '99.9% Fraud Detection Rate',
      features: [
        'AI voice impersonation detection',
        'Video authentication',
        'Compliance & audit trails',
      ],
    },
    {
      title: 'Education & Research',
      description:
        'Teach media literacy, verify research sources, and combat academic dishonesty. Empower students and researchers with critical verification skills.',
      image:
        'https://images.unsplash.com/photo-1588600878108-578307a3cc9d?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=2940&auto=format&fit=crop',
      icon: GraduationCap,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      stats: '200+ Universities',
      features: [
        'Academic source verification',
        'Media literacy tools',
        'Research integrity checks',
      ],
    },
    {
      title: 'Legal & Compliance',
      description:
        'Authenticate digital evidence, verify document authenticity, and ensure chain of custody. Essential for litigation, investigations, and regulatory compliance.',
      image:
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2940&auto=format&fit=crop',
      icon: Scale,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
      stats: '150+ Law Firms',
      features: [
        'Digital evidence authentication',
        'Forensic-grade reports',
        'Chain of custody tracking',
      ],
    },
    {
      title: 'Government & Public Sector',
      description:
        'Combat election interference, verify public communications, and protect democratic processes. Detect disinformation campaigns before they spread.',
      image:
        'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=2940&auto=format&fit=crop',
      icon: Users,
      gradient: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50',
      stats: '300+ Government Agencies',
      features: [
        'Disinformation detection',
        'Election integrity monitoring',
        'Public safety verification',
      ],
    },
    {
      title: 'Content Creators & Influencers',
      description:
        'Protect your brand from impersonation, verify collaboration requests, and maintain authenticity. Prove your content is genuine and build audience trust.',
      image:
        'https://images.unsplash.com/photo-1630797160666-38e8c5ba44c1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: Briefcase,
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50',
      stats: '10K+ Creators Protected',
      features: [
        'Brand impersonation detection',
        'Content authenticity certificates',
        'Deepfake protection',
      ],
    },
  ];

  return (
    <section
      id="use-cases"
      className="relative py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              Trusted Across Industries
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Securing the Channels</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              You Trust
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From newsrooms to boardrooms, courtrooms to
            classrooms—SafeguardMedia protects the critical channels that power
            our society.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {channels.map((channel, index) => {
            const IconComponent = channel.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={channel.title}
                className="relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${channel.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-75 transition duration-500`}
                />

                {/* Card */}
                <div
                  className={`relative h-full bg-white rounded-3xl overflow-hidden transition-all duration-500 border-2 ${
                    isHovered
                      ? 'border-transparent shadow-2xl transform -translate-y-2'
                      : 'border-gray-100 shadow-lg'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${channel.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10`}
                    />
                    <Image
                      src={channel.image}
                      alt={channel.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Icon Overlay */}
                    <div className="absolute top-4 right-4 z-20">
                      <div
                        className={`w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-500 ${
                          isHovered ? 'scale-110 rotate-6' : ''
                        }`}
                      >
                        <IconComponent
                          className={`w-6 h-6 bg-gradient-to-br ${channel.gradient} bg-clip-text text-transparent`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${channel.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    />

                    <div className="relative z-10">
                      {/* Title */}
                      <h3
                        className={`text-xl font-bold mb-3 transition-all duration-300 ${
                          isHovered
                            ? `bg-gradient-to-r ${channel.gradient} bg-clip-text text-transparent`
                            : 'text-gray-900'
                        }`}
                      >
                        {channel.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {channel.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-4">
                        {channel.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${channel.gradient}`}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Stats Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${channel.gradient}`}
                        />
                        <span className="text-xs font-semibold text-gray-700">
                          {channel.stats}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20" />

          {/* CTA Container */}
          {/* <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Protect Your Organization?
              </h3>
              <p className="text-lg text-blue-100 mb-8">
                Join thousands of organizations using SafeguardMedia to verify
                content and combat misinformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
