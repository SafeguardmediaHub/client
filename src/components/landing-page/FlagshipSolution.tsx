import { Brain, Eye, Zap } from 'lucide-react';

export default function FlagshipSolution() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Flagship Solution:{' '}
              <span className="text-blue-600">AI Deepfake Detection.</span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our model instantly verify your media and protect you from digital
              deception.
            </p>

            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Try DF Detector</span>
              <Brain size={20} />
            </button>
          </div>

          {/* Right Content - Features */}
          <div className="space-y-8">
            {/* Multimodal Analysis */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Multimodal Analysis
                  </h3>
                  <p className="text-gray-600">
                    Detect fake across video, audio, and images with our unified
                    engine.
                  </p>
                </div>
              </div>
            </div>

            {/* High Accuracy Results */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    High Accuracy Results
                  </h3>
                  <p className="text-gray-600">
                    Powered by AI models with a 98+ detection accuracy rate.
                  </p>
                </div>
              </div>
            </div>

            {/* Built for Your Workflow */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Built for Your Workflow
                  </h3>
                  <p className="text-gray-600">
                    Integrate seamlessly with our API or use our intuitive web
                    interface designed for verifiers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
