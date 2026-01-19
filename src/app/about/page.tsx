'use client';

import {
  ArrowRight,
  Briefcase,
  Code,
  FileText,
  Lightbulb,
  Shield,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HeroHeader } from '@/components/header';
import Footer from '@/components/landing-page/Footer';

export default function AboutPage() {
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);

  const teams = [
    {
      name: 'Research',
      icon: Lightbulb,
      description:
        'Advancing AI detection algorithms and forensic analysis techniques to stay ahead of emerging threats.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      name: 'Policy',
      icon: FileText,
      description:
        'Ensuring ethical AI practices, data privacy compliance, and responsible verification standards.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      name: 'Operations',
      icon: Briefcase,
      description:
        'Scaling infrastructure, maintaining 99.9% uptime, and delivering reliable verification services globally.',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      name: 'Product',
      icon: Code,
      description:
        'Building intuitive tools that empower users to verify content quickly and confidently.',
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
    },
  ];

  return (
    <>
      <HeroHeader />
      <div className="min-h-screen bg-[hsl(40,40%,95%)]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-200/30 rounded-full mix-blend-multiply filter blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-6">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  About SafeguardMedia
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-[hsl(220,40%,15%)] mb-6 leading-tight">
                Defending Truth in the
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Age of AI
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We're building the infrastructure to verify digital content and
                combat misinformation at scale.
              </p>
            </div>
          </div>
        </section>

        {/* Founding Story */}
        <section className="relative py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">
                    Our Story
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[hsl(220,40%,15%)] leading-tight">
                  Born from a Crisis of Trust
                </h2>
                <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                  <p>
                    In 2023, as deepfakes and AI-generated content became
                    indistinguishable from reality, we witnessed a fundamental
                    crisis: people could no longer trust what they saw and
                    heard.
                  </p>
                  <p>
                    Journalists struggled to verify viral videos. Educators
                    fought misinformation in classrooms. Organizations faced
                    sophisticated impersonation attacks. The tools to create
                    synthetic media had democratized, but the tools to detect
                    them hadn't.
                  </p>
                  <p>
                    We founded SafeguardMedia with a singular mission: to
                    restore trust in digital content by making verification
                    accessible, accurate, and instant.
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition duration-500" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-gray-200">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
                    alt="Team collaboration"
                    width={800}
                    height={600}
                    className="w-full h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="relative py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-25 transition duration-500" />
                <div className="relative bg-white rounded-3xl p-10 border-2 border-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-[hsl(220,40%,15%)] mb-4">
                    Our Mission
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    To empower individuals and organizations with the tools to
                    verify digital content authenticity, combat misinformation,
                    and restore trust in media through accessible, AI-powered
                    verification technology.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-25 transition duration-500" />
                <div className="relative bg-white rounded-3xl p-10 border-2 border-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-[hsl(220,40%,15%)] mb-4">
                    Our Vision
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    A world where truth prevails over deception, where every
                    piece of digital content can be verified instantly, and
                    where trust in media is restored through transparency and
                    technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We're Building */}
        <section className="relative py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-6">
                <Code className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600">
                  Our Approach
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[hsl(220,40%,15%)] mb-6">
                How We're Building the Solution
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A multi-layered approach combining cutting-edge AI, forensic
                analysis, and human expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI-Powered Detection',
                  description:
                    'Training advanced neural networks on millions of authentic and synthetic media samples to detect even the most sophisticated deepfakes.',
                  icon: Shield,
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  title: 'Forensic Analysis',
                  description:
                    'Analyzing metadata, compression artifacts, and pixel-level inconsistencies to uncover signs of manipulation invisible to the human eye.',
                  icon: Target,
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  title: 'Continuous Learning',
                  description:
                    'Constantly updating our models with new attack vectors and techniques, staying ahead of evolving threats in the AI arms race.',
                  icon: Lightbulb,
                  gradient: 'from-emerald-500 to-teal-500',
                },
              ].map((approach) => {
                const IconComponent = approach.icon;
                return (
                  <div key={approach.title} className="relative group">
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${approach.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-25 transition duration-500`}
                    />
                    <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-500 h-full">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${approach.gradient} rounded-xl flex items-center justify-center mb-6`}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[hsl(220,40%,15%)] mb-3">
                        {approach.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {approach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="relative py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-6">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-600">
                  Our Team
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[hsl(220,40%,15%)] mb-6">
                Built by Experts, For Everyone
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our multidisciplinary team brings together expertise from AI
                research, cybersecurity, journalism, and policy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teams.map((team, index) => {
                const IconComponent = team.icon;
                const isHovered = hoveredTeam === index;

                return (
                  <button
                    type="button"
                    key={team.name}
                    className="relative group text-left"
                    onMouseEnter={() => setHoveredTeam(index)}
                    onMouseLeave={() => setHoveredTeam(null)}
                  >
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${team.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-50 transition duration-500`}
                    />
                    <div
                      className={`relative bg-white rounded-3xl p-8 transition-all duration-500 border-2 h-full ${
                        isHovered
                          ? 'border-transparent shadow-2xl transform -translate-y-2'
                          : 'border-gray-100 shadow-lg'
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${team.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                      <div className="relative z-10">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${team.gradient} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 ${
                            isHovered ? 'scale-110 rotate-6' : ''
                          }`}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[hsl(220,40%,15%)] mb-3">
                          {team.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {team.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-20" />

              {/* Content */}
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Join Us in Defending Truth
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Be part of the movement to restore trust in digital media. Get
                  early access to our beta platform.
                </p>
                <Link href="/auth/signup">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Join Beta Waitlist
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Image Below CTA */}
            <div className="mt-12 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2940&auto=format&fit=crop"
                  alt="Team working together"
                  width={1400}
                  height={600}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
