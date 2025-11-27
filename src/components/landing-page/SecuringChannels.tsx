export default function SecuringChannels() {
  const channels = [
    {
      title: 'Journalism & News Integrity',
      description:
        "SafeguardMedia's API automatically analyzes both video and audio for signs of manipulation, providing a confidence score and a detailed report following acceptance.",
      image:
        'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Corporate Cybersecurity & Fraud Prevention',
      description:
        'SafeguardMedia monitors internal files for synthetic, artificially AI-generated voices and AI-powered impersonation threats.',
      image:
        'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Safeguarding Public Information Channels',
      description:
        'Detect media-based election interference and disinformation campaigns.',
      image:
        'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Securing the Channels You Trust
            </h2>
          </div>
          <div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Deepfakes are attacks on our most critical channels of
              communication, commerce, and democracy. See areas SafeguardMedia
              is deployed to protect these vital pathways from being
              compromised.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {channels.map((channel, index) => (
            <div
              key={channel.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {channel.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {channel.description}
                </p>
              </div>
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <img
                  src={channel.image}
                  alt={channel.title}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
