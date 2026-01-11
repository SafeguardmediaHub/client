# SafeguardMedia Client

**AI-Powered Misinformation Detection Platform**

SafeguardMedia is an advanced media verification platform that helps journalists, investigators, NGOs, and content moderators detect misinformation, deepfakes, and manipulated media through comprehensive AI-powered analysis tools.

## 🌟 Features

### Core Verification Tools
- **🔍 Metadata Extraction** - Extract and analyze EXIF data, timestamps, camera information, and file properties
- **🎭 Deepfake Detection** - AI-powered detection of synthetic and manipulated media
- **🔬 Forensic Analysis** - Advanced tamper detection using ELA, noise analysis, and copy-move detection
- **✅ C2PA Verification** - Validate content authenticity using Coalition for Content Provenance and Authenticity standards
- **📍 Geolocation Matching** - Verify location claims with visual landmark recognition and coordinate validation
- **🔄 Reverse Image/Video Lookup** - Search across multiple platforms to find original sources
- **📊 Timeline Analysis** - Cross-reference timestamps and metadata to verify content recency
- **🎵 Audio Forensics** - Analyze audio files for manipulation and authenticity

### Advanced Features
- **🔎 Fact-Checking** - AI-powered claim extraction and verification using LLM and real-time web search
- **🌐 Social Media Tracing** - Track content spread across platforms with visual search and perceptual hashing
- **📦 Batch Processing** - Verify multiple files simultaneously with comprehensive reporting
- **🤖 AI Intent Assistant** - ChatGPT-style assistant that guides users through optimal verification workflows
- **📈 Reporting Dashboard** - Generate detailed verification reports with visual evidence
- **💬 Real-time Updates** - WebSocket-powered live progress tracking for long-running analyses

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- pnpm 10.13.1+
- Backend API running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   # Add other required environment variables
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query (React Query)
- **Real-time**: Socket.io Client
- **Maps**: React Leaflet, Google Maps API
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Code Quality**: Biome (linting & formatting)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application features
│   │   ├── authenticity/  # C2PA verification
│   │   ├── fact-check/    # Fact-checking interface
│   │   ├── geolocation/   # Geolocation matching
│   │   ├── library/       # Media library
│   │   ├── reverse/       # Reverse lookup
│   │   ├── timeline/      # Timeline analysis
│   │   ├── trace/         # Social media tracing
│   │   └── visual/        # Visual forensics
│   └── layout.tsx         # Root layout with metadata
├── components/            # Reusable UI components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API clients
└── types/                # TypeScript type definitions
```

## 📜 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
```

## 🎯 Key User Workflows

### 1. Quick Verification
Upload media → AI Assistant suggests optimal workflow → Run automated checks → Get comprehensive report

### 2. Guided Investigation
Describe your verification goal → Assistant recommends tool combination → Execute step-by-step → Export findings

### 3. Batch Analysis
Upload multiple files → Configure verification settings → Process in parallel → Download batch report

## 📚 Documentation

- **[AI Intent Assistant](./AI_INTENT_ASSISTANT.md)** - Learn about the intelligent workflow guidance system
- **[Testing Checklist](./TESTING_CHECKLIST.md)** - Comprehensive testing guide for all features
- **[Claude Integration](./CLAUDE.md)** - Development notes and AI assistance guidelines

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | Yes |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (for geolocation) | Optional |

## 🤝 Contributing

1. Follow the existing code style (enforced by Biome)
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## 📄 License

[Add your license information here]

## 🆘 Support

For issues, questions, or feature requests, please contact the SafeguardMedia team.

---

**Built with ❤️ by the SafeguardMedia Team**
