'use client';

import { ArrowRight, ExternalLink, Rocket, Users } from 'lucide-react';
import Image from 'next/image';

export default function FutureSection() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-white via-purple-50/30 to-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
              <Rocket className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">
                Join Our Mission
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Shaping The Future of{' '}
              <span className="text-purple-600">Digital Security</span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              At Safeguardmedia, we believe the best way to protect the future
              is to build it. Join our passionate team on a mission to ensure
              that AI is a tool for clarity and transparency, not confusion and
              deception.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-100">
                <div className="text-3xl font-bold text-purple-600">50+</div>
                <div className="text-sm text-gray-600 mt-1">Team Members</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">15+</div>
                <div className="text-sm text-gray-600 mt-1">Countries</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-emerald-100">
                <div className="text-3xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">Remote</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="px-8 py-4 rounded-xl font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                See Open Roles
                <ExternalLink className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="px-8 py-4 rounded-xl font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                Partner with Us
                <Users className="w-5 h-5" />
              </button>
            </div>

            {/* Testimonial */}
            <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 italic mb-2">
                    "Working at Safeguardmedia means being at the forefront of
                    defending truth in the digital age."
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    — Engineering Team
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition duration-500" />

            {/* Image Container */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-gray-200 group-hover:border-transparent transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Team collaboration"
                width={800}
                height={600}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold text-gray-900">
                      We're Hiring! Join our team
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-900 ml-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 lg:-right-8 bg-white rounded-2xl p-4 shadow-2xl shadow-purple-500/20 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    5+ Years
                  </div>
                  <div className="text-xs text-gray-600">Innovation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
