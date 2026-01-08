'use client';

import { Brain, Eye, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

export default function FlagshipSolution() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Eye,
      title: 'Multimodal Analysis',
      description:
        'Detect fake across video, audio, and images with our unified engine.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Zap,
      title: 'High Accuracy Results',
      description: 'Powered by AI models with a 98+ detection accuracy rate.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      icon: Brain,
      title: 'Built for Your Workflow',
      description:
        'Integrate seamlessly with our API or use our intuitive web interface designed for verifiers.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
  ];

  return (
    <section
      id="solutions"
      className="relative py-32 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                Flagship Solution
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              AI Deepfake <span className="text-blue-600">Detection.</span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Our model instantly verify your media and protect you from digital
              deception with cutting-edge AI technology.
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                className="px-8 py-4 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 flex items-center gap-2"
              >
                Try DF Detector
                <Brain className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">
                  <span className="animate-pulse">98%</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">Accuracy</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">&lt;1s</div>
                <div className="text-sm text-gray-600 mt-1">Response</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-emerald-100">
                <div className="text-3xl font-bold text-emerald-600">24/7</div>
                <div className="text-sm text-gray-600 mt-1">Available</div>
              </div>
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isHovered = hoveredCard === index;

              return (
                <div
                  key={feature.title}
                  className="relative group"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Glow effect */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}
                  />

                  {/* Card */}
                  <div
                    className={`relative bg-white/80 backdrop-blur-md p-8 rounded-3xl border-2 transition-all duration-500 ${
                      isHovered
                        ? 'border-transparent shadow-2xl transform scale-105'
                        : 'border-gray-100 shadow-lg'
                    }`}
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                    />

                    <div className="relative flex items-start space-x-5">
                      {/* Icon */}
                      <div
                        className={`relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isHovered ? 'scale-110 rotate-6' : ''
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-20`}
                        />
                        <IconComponent
                          className={`relative w-8 h-8 bg-gradient-to-br ${
                            feature.gradient
                          } bg-clip-text text-transparent transition-transform duration-500 ${
                            isHovered ? 'scale-110' : ''
                          }`}
                          style={{
                            filter: isHovered
                              ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))'
                              : 'none',
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div
                      className={`absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden pointer-events-none ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      } transition-opacity duration-500`}
                    >
                      <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        .group:hover .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}
