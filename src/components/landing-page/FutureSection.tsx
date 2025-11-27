import { ExternalLink, Users } from 'lucide-react';

export default function FutureSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Shaping The Future of{' '}
              <span className="text-blue-600">Digital Security</span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              At SafeguardMedia, we believe the best way to protect the future
              is to build it. Join our passionate team on a mission to ensure
              that AI is a tool for clarity and transparency, not confusion and
              deception.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <span>See Open Roles</span>
                <ExternalLink size={20} />
              </button>

              <button
                type="button"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <span>Partner with Us</span>
                <Users size={20} />
              </button>
            </div>
          </div>

          <div>
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Team collaboration"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
