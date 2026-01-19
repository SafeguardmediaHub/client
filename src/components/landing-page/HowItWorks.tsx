/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
'use client';

import { ArrowRight, CheckCircle, Sparkles, Upload } from 'lucide-react';
import { useState } from 'react';

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'Upload Your Content',
      description:
        'Drop your image, video, audio file, or paste a claim. We support all major formats and accept URLs.',
      icon: Upload,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      detail: "Drag & drop or paste - it's that simple",
    },
    {
      number: '02',
      title: 'AI-Powered Analysis',
      description:
        'Our suite of 8 verification tools automatically analyzes your content using advanced AI and forensic techniques.',
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      detail: 'Multiple tools working in parallel',
    },
    {
      number: '03',
      title: 'Get Instant Results',
      description:
        'Receive comprehensive reports with confidence scores, evidence, and actionable insights in seconds.',
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      detail: 'Clear verdicts with detailed citations',
    },
  ];

  //   const stats = [
  //     {
  //       value: '<60s',
  //       label: 'Average Analysis Time',
  //       icon: Zap,
  //       gradient: 'from-blue-500 to-cyan-500',
  //     },
  //     {
  //       value: '8',
  //       label: 'Verification Tools',
  //       icon: Shield,
  //       gradient: 'from-purple-500 to-pink-500',
  //     },
  //     {
  //       value: '24/7',
  //       label: 'Always Available',
  //       icon: CheckCircle,
  //       gradient: 'from-emerald-500 to-teal-500',
  //     },
  //   ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              Simple & Powerful
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">How It</span>{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Verify any content in three simple steps. Our AI-powered platform
            does the heavy lifting while you focus on what matters.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isHovered = hoveredStep === index;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative">
                {/* Connector Arrow (not on last item) */}
                {!isLast && (
                  <div className="hidden md:block absolute top-24 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0">
                    <ArrowRight className="absolute -right-2 -top-2 w-5 h-5 text-gray-400" />
                  </div>
                )}

                <div
                  className="relative group h-full"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${step.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-75 transition duration-500`}
                  />

                  {/* Card */}
                  <div
                    className={`relative h-full bg-white rounded-3xl p-8 transition-all duration-500 border-2 ${
                      isHovered
                        ? 'border-transparent shadow-2xl transform -translate-y-2'
                        : 'border-gray-100 shadow-lg'
                    }`}
                  >
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Step Number */}
                      <div
                        className={`text-6xl font-bold mb-6 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent opacity-20`}
                      >
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${step.gradient} p-0.5 transition-transform duration-500 ${
                          isHovered ? 'scale-110 rotate-6' : ''
                        }`}
                      >
                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                          <IconComponent
                            className={`w-8 h-8 bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent`}
                          />
                        </div>
                      </div>

                      {/* Text */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Detail Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <span className="text-xs font-medium text-gray-600">
                          {step.detail}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-3xl blur-xl opacity-20" />

          {/* Stats Container */}
          {/* <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-gray-100 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center group cursor-pointer"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-300">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} p-0.5`}
                      >
                        <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                          <IconComponent
                            className={`w-7 h-7 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div> */}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to verify your first piece of content?
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300"
          >
            Join Beta Waitlist
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
