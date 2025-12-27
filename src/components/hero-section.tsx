'use client';

import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { Button } from '@/components/ui/button';
import { TextEffect } from '@/components/ui/text-effect';
import { HeroHeader } from './header';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden relative">
        {/* Animated Gradient Background Mesh */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-sky-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-2 h-2 bg-blue-400 rounded-full animate-float" />
          <div className="absolute top-40 right-[15%] w-3 h-3 bg-cyan-400 rounded-full animate-float animation-delay-1000" />
          <div className="absolute top-60 left-[20%] w-2 h-2 bg-sky-400 rounded-full animate-float animation-delay-2000" />
          <div className="absolute top-96 right-[25%] w-3 h-3 bg-indigo-400 rounded-full animate-float animation-delay-3000" />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="/dashboard/authenticity"
                    className="hover:bg-white/80 dark:hover:border-t-border bg-white/60 backdrop-blur-sm group mx-auto flex w-fit items-center gap-4 rounded-full border border-blue-200 p-1 pl-4 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/30 hover:scale-105"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                      <span className="text-blue-600 text-sm font-semibold">
                        Introducing C2PA Verification
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm text-gray-600">— Now Live!</span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-blue-200"></span>

                    <div className="bg-blue-600 size-6 overflow-hidden rounded-full duration-500 flex items-center justify-center">
                      <ArrowRight className="size-3 text-white" />
                    </div>
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-bold max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem] text-gray-900"
                >
                  The Standard for Digital Trust
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg text-gray-600"
                >
                  Arm your organization with the industry's most comprehensive
                  AI suite to instantly detect deepfakes, verify multimedia
                  content, and protect your assets from digital fraud.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row"
                >
                  <div
                    key={1}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-slow" />
                    <Button
                      asChild
                      size="lg"
                      className="relative rounded-xl px-8 py-6 text-base bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-xl"
                    >
                      <Link href="/auth/signup" className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <span className="text-nowrap font-semibold">Get Started Free</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-xl px-8 border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
                  >
                    <Link href="/about" className="flex items-center gap-2">
                      <span className="text-nowrap">Watch Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </AnimatedGroup>

                {/* Trust Indicators */}
                <AnimatedGroup
                  variants={transitionVariants}
                  className="mt-16 flex items-center justify-center gap-8 flex-wrap"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      98%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Accuracy Rate</div>
                  </div>
                  <div className="h-12 w-px bg-gray-300" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      1M+
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Media Verified</div>
                  </div>
                  <div className="h-12 w-px bg-gray-300" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">
                      500+
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Organizations</div>
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="mask-b-from-55% relative -mr-56 mt-16 overflow-hidden px-2 sm:mr-0 sm:mt-20 md:mt-24">
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border-2 border-blue-200/50 p-4 shadow-2xl shadow-blue-500/20 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 backdrop-blur-sm">
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
                  <Image
                    className="relative rounded-2xl border border-gray-200/50 shadow-xl"
                    src="https://images.unsplash.com/photo-1685391896546-9abaf50bfc99?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.75;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
