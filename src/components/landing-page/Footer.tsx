'use client';

import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Shield,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Verification Tools', href: '/#solutions' },
        { label: 'Use Cases', href: '/#use-cases' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'API Documentation', href: '/docs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press Kit', href: '/press' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Help Center', href: '/help' },
        { label: 'Community', href: '/community' },
        { label: 'Research Papers', href: '/research' },
        { label: 'Status', href: '/status' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Security', href: '/security' },
        { label: 'Compliance', href: '/compliance' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@safeguardmedia.com', label: 'Email' },
  ];

  return (
    <footer className="relative bg-[hsl(220,40%,15%)] text-white overflow-hidden">
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      {/* Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(hsl(190,95%,55%)_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Diagonal Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[hsl(190,95%,55%)]/5 transform skew-x-12 translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 border-b border-white/10">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Brand Section - Takes 5 columns */}
            <div className="lg:col-span-5 space-y-6">
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-blue-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300" />
                  <div className="relative w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  Safeguardmedia
                </span>
              </Link>

              {/* Tagline */}
              <p className="text-lg text-gray-300 leading-relaxed max-w-md">
                Defending truth in the age of AI. Building the infrastructure to
                verify digital content and combat misinformation at scale.
              </p>

              {/* Newsletter */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[hsl(190,95%,55%)]">
                  Stay Updated
                </h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[hsl(190,95%,55%)] focus:ring-1 focus:ring-[hsl(190,95%,55%)] transition-all"
                  />
                  <button
                    type="button"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[hsl(190,95%,55%)] rounded-lg flex items-center justify-center transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-[hsl(190,95%,55%)] transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Grid - Takes 7 columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[hsl(35,85%,60%)]">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                          onMouseEnter={() => setHoveredLink(link.label)}
                          onMouseLeave={() => setHoveredLink(null)}
                        >
                          <span className="relative">
                            {link.label}
                            <span
                              className={`absolute -bottom-0.5 left-0 h-px bg-[hsl(190,95%,55%)] transition-all duration-300 ${
                                hoveredLink === link.label ? 'w-full' : 'w-0'
                              }`}
                            />
                          </span>
                          <ArrowRight
                            className={`w-3 h-3 transition-all duration-300 ${
                              hoveredLink === link.label
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-2'
                            }`}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} Safeguardmedia.</span>
              <span className="hidden md:inline">•</span>
              <span>All rights reserved.</span>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>All Systems Operational</span>
              </div>
              <span className="hidden md:inline">•</span>
              <span>SOC 2 Type II Certified</span>
              <span className="hidden md:inline">•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
