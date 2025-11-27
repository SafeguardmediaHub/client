import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Search,
  Shield,
} from 'lucide-react';

export default function CoreCapabilities() {
  const capabilities = [
    {
      title: 'Deepfake Detection',
      description:
        'Rapidly comprehend faces by training advanced facial expressions, and AI-generated content across multiple media formats.',
      icon: Shield,
    },
    {
      title: 'Real-Time Fact-Checking',
      description:
        'Integrate with reputable fact-checking sources and AI-images and Data Check algorithms to verify content authenticity in real-time.',
      icon: Clock,
    },
    {
      title: 'Visual Authenticity Reports',
      description:
        'Generate comprehensive reports that analyze potential manipulation, metadata analysis, and source verification.',
      icon: BarChart3,
    },
    {
      title: 'Cheapfakes & Shallowfake Detection',
      description:
        'Identifies low-tech edits such as speed manipulation, frame splicing, miscontextualization, and basic editing techniques.',
      icon: Search,
    },
    {
      title: 'Crowdsourced Verification Portal',
      description:
        'Allow verified journalists, fact-checkers, and media professionals to annotate or debunk, and verify content through our platform.',
      icon: CheckCircle,
    },
    {
      title: 'Live Detection Tool',
      description:
        'Real-time analysis during live broadcasts, video conferences, and streaming to detect manipulation as it occurs.',
      icon: AlertTriangle,
    },
    {
      title: 'Metadata and Geolocation Analysis',
      description:
        'Forensics and evidence validation as a CSI-level deep media files to determine the original source and authenticity.',
      icon: BarChart3,
    },
    {
      title: 'Risk Scoring System',
      description:
        'Combines multiple analysis results into a single risk score helping decision-makers make a quick assessment.',
      icon: Shield,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Core Capabilities at a Glance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These tools are designed to move beyond the initial question of
            authenticity and provide answers to the more profound challenges of
            accuracy and safety.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((capability) => {
            const IconComponent = capability.icon;
            return (
              <div
                key={capability.title}
                className="bg-gray-50 p-6 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {capability.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {capability.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
