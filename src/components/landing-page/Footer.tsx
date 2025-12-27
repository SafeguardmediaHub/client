export default function Footer() {
  const footerLinks = {
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Resources', href: '#' },
    ],
    solutions: [
      { name: 'AI Deepfake Detection', href: '#' },
      { name: 'AI-Assisted Fact-Checking', href: '#' },
      { name: 'Cybersecurity & Fraud Prevention', href: '#' },
    ],
    legal: [
      { name: 'Legal & Terms', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Compliance (SOC2, GDPR, CCPA)', href: '#' },
    ],
  };

  return (
    <footer className="bg-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 transform transition-transform duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-lg drop-shadow-lg">S</span>
                </div>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                SafeguardMedia
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              The industry standard for digital trust and AI-powered content
              verification.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-indigo-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
