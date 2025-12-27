'use client';

import { CheckCircle, Shield, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function SecuringChannels() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const channels = [
    {
      title: 'Journalism & News Integrity',
      description:
        "SafeguardMedia's API automatically analyzes both video and audio for signs of manipulation, providing a confidence score and a detailed report following acceptance.",
      image:
        'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      stats: '1,000+ Articles Verified Daily',
    },
    {
      title: 'Corporate Cybersecurity & Fraud Prevention',
      description:
        'SafeguardMedia monitors internal files for synthetic, artificially AI-generated voices and AI-powered impersonation threats.',
      image:
        'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=400',
      icon: CheckCircle,
      gradient: 'from-blue-500 to-indigo-500',
      stats: '99.9% Fraud Detection Rate',
    },
    {
      title: 'Safeguarding Public Information Channels',
      description:
        'Detect media-based election interference and disinformation campaigns.',
      image:
        'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=400',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      stats: '500+ Government Agencies',
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 rounded-full mix-blend-multiply filter blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                Protection at Scale
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-gray-900">
                Securing the Channels
              </span>
              <br />
              <span className="text-gray-900">You Trust</span>
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="text-xl text-gray-600 leading-relaxed">
              Deepfakes are attacks on our most critical channels of
              communication, commerce, and democracy. See areas SafeguardMedia
              is deployed to protect these vital pathways from being
              compromised.
            </p>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="space-y-16">
          {channels.map((channel, index) => {
            const IconComponent = channel.icon;
            const isHovered = hoveredIndex === index;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={channel.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  isReversed ? 'lg:grid-flow-col-dense' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Content */}
                <div className={isReversed ? 'lg:col-start-2' : ''}>
                  <div className="space-y-6">
                    {/* Icon & Number */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${channel.gradient} p-0.5 transition-transform duration-500 ${
                          isHovered ? 'scale-110 rotate-6' : ''
                        }`}
                      >
                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                          <IconComponent
                            className={`w-8 h-8 bg-gradient-to-br ${channel.gradient} bg-clip-text text-transparent`}
                          />
                        </div>
                      </div>
                      <div
                        className={`text-6xl font-bold bg-gradient-to-br ${channel.gradient} bg-clip-text text-transparent opacity-20`}
                      >
                        0{index + 1}
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-3xl font-bold transition-all duration-300 ${
                        isHovered
                          ? `bg-gradient-to-r ${channel.gradient} bg-clip-text text-transparent`
                          : 'text-gray-900'
                      }`}
                    >
                      {channel.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {channel.description}
                    </p>

                    {/* Stats Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${channel.gradient}`}
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {channel.stats}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className={`relative group ${isReversed ? 'lg:col-start-1' : ''}`}>
                  {/* Glow */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${channel.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-50 transition duration-500`}
                  />

                  {/* Image Container */}
                  <div className="relative rounded-3xl overflow-hidden border-2 border-gray-200 group-hover:border-transparent transition-all duration-500">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${channel.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    />
                    <Image
                      src={channel.image}
                      alt={channel.title}
                      width={600}
                      height={400}
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-6 left-6 right-6">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full`}
                        >
                          <IconComponent className="w-4 h-4 text-gray-900" />
                          <span className="text-sm font-semibold text-gray-900">
                            {channel.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
