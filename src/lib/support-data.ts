import {
  BookOpen,
  Code,
  CreditCard,
  Lock,
  type LucideIcon,
  Shield,
  Wrench,
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  articleCount: number;
  color: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export const categories: Category[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics and get up to speed quickly',
    icon: BookOpen,
    articleCount: 8,
    color: '#6366f1', // indigo
  },
  {
    id: 'features',
    name: 'Features & Tools',
    description: 'Explore our verification and detection tools',
    icon: Shield,
    articleCount: 12,
    color: '#8b5cf6', // violet
  },
  {
    id: 'account',
    name: 'Account & Billing',
    description: 'Manage your account, subscription, and team',
    icon: CreditCard,
    articleCount: 6,
    color: '#10b981', // emerald
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Fix common issues and errors',
    icon: Wrench,
    articleCount: 10,
    color: '#f59e0b', // amber
  },
  {
    id: 'api',
    name: 'API & Integration',
    description: 'Developer resources and API documentation',
    icon: Code,
    articleCount: 7,
    color: '#06b6d4', // cyan
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    description: 'Data protection, compliance, and security',
    icon: Lock,
    articleCount: 5,
    color: '#ef4444', // red
  },
];

export const faqs: FAQItem[] = [
  // Getting Started
  {
    id: 'gs-1',
    question: 'How do I upload media for verification?',
    answer:
      'You can upload media by clicking the "Upload" button in the dashboard or dragging and dropping files directly. We support images (JPG, PNG, WebP), videos (MP4, MOV, AVI), and audio files (MP3, WAV). Maximum file size is 500MB.',
    category: 'getting-started',
    tags: ['upload', 'media', 'files'],
  },
  {
    id: 'gs-2',
    question: 'What file formats are supported?',
    answer:
      'We support a wide range of formats: Images (JPG, PNG, WebP, GIF, HEIC), Videos (MP4, MOV, AVI, MKV, WebM), and Audio (MP3, WAV, AAC, FLAC). For best results, use high-quality original files.',
    category: 'getting-started',
    tags: ['formats', 'files', 'upload'],
  },
  {
    id: 'gs-3',
    question: 'How do I interpret verification results?',
    answer:
      'Results are presented in a comprehensive report with multiple sections: Summary (overall assessment), Detection Results (AI-generated content, tampering), Metadata Analysis (EXIF, C2PA), and Recommendations. Each section includes confidence scores and detailed explanations.',
    category: 'getting-started',
    tags: ['results', 'interpretation', 'reports'],
  },
  {
    id: 'gs-4',
    question: 'What is the difference between the verification tools?',
    answer:
      'Each tool serves a specific purpose: AI Detection identifies synthetic content, Tamper Detection finds manipulations, Reverse Lookup finds similar images online, Timeline Verification checks chronological consistency, Geolocation Verification validates location claims, and Fact Checking cross-references claims with trusted sources.',
    category: 'getting-started',
    tags: ['tools', 'features', 'differences'],
  },
  {
    id: 'gs-5',
    question: 'How long does verification take?',
    answer:
      'Processing time varies by file size and complexity. Small images typically process in 10-30 seconds, while large videos may take 2-5 minutes. You can track progress in real-time and will receive a notification when complete.',
    category: 'getting-started',
    tags: ['processing', 'time', 'speed'],
  },
  {
    id: 'gs-6',
    question: 'Can I verify multiple files at once?',
    answer:
      'Yes! Use our Batch Processing feature to upload and verify multiple files simultaneously. You can upload up to 50 files per batch, and results will be organized in a single report for easy comparison.',
    category: 'getting-started',
    tags: ['batch', 'multiple', 'files'],
  },
  {
    id: 'gs-7',
    question: 'How accurate are the verification results?',
    answer:
      'Our AI models achieve 95%+ accuracy on standard benchmarks. However, accuracy depends on file quality, manipulation sophistication, and available metadata. We provide confidence scores with each result to help you assess reliability.',
    category: 'getting-started',
    tags: ['accuracy', 'reliability', 'confidence'],
  },
  {
    id: 'gs-8',
    question: 'What should I do if results are inconclusive?',
    answer:
      "Inconclusive results mean our system couldn't make a confident determination. Try: 1) Using a higher quality version of the file, 2) Running additional verification tools, 3) Checking metadata manually, or 4) Contacting our support team for expert analysis.",
    category: 'getting-started',
    tags: ['inconclusive', 'uncertain', 'help'],
  },

  // Features & Tools
  {
    id: 'ft-1',
    question: 'How does AI-generated media detection work?',
    answer:
      'Our AI detection uses deep learning models trained on millions of real and synthetic images. It analyzes pixel patterns, compression artifacts, and statistical anomalies that are characteristic of AI-generated content from tools like DALL-E, Midjourney, and Stable Diffusion.',
    category: 'features',
    tags: ['ai', 'detection', 'deepfake'],
  },
  {
    id: 'ft-2',
    question: 'What is C2PA verification?',
    answer:
      'C2PA (Coalition for Content Provenance and Authenticity) is a standard for embedding cryptographic signatures in media files. Our C2PA verification checks these signatures to confirm authenticity, track edits, and verify the source of content.',
    category: 'features',
    tags: ['c2pa', 'authenticity', 'provenance'],
  },
  {
    id: 'ft-3',
    question: 'How accurate is tamper detection?',
    answer:
      'Our tamper detection achieves 92-97% accuracy depending on manipulation type. It excels at detecting cloning, splicing, and retouching. Subtle edits or professional forgeries may require manual review. We provide heatmaps showing suspected tampered regions.',
    category: 'features',
    tags: ['tamper', 'manipulation', 'accuracy'],
  },
  {
    id: 'ft-4',
    question: 'Can I verify social media posts?',
    answer:
      'Yes! You can verify social media content by: 1) Taking screenshots and uploading them, 2) Downloading media from posts and uploading files, or 3) Using our browser extension to verify content directly on social platforms (coming soon).',
    category: 'features',
    tags: ['social media', 'posts', 'verification'],
  },
  {
    id: 'ft-5',
    question: 'What is reverse image lookup?',
    answer:
      'Reverse image lookup searches the internet for visually similar images to help you find the original source, earlier versions, or related content. This is useful for identifying recycled or misattributed images.',
    category: 'features',
    tags: ['reverse', 'lookup', 'search'],
  },
  {
    id: 'ft-6',
    question: 'How does geolocation verification work?',
    answer:
      'Geolocation verification analyzes GPS metadata, visible landmarks, shadows, weather patterns, and architectural features to confirm or dispute location claims. It cross-references with satellite imagery and geographic databases.',
    category: 'features',
    tags: ['geolocation', 'location', 'gps'],
  },
  {
    id: 'ft-7',
    question: 'What is timeline verification?',
    answer:
      'Timeline verification checks the chronological consistency of media by analyzing metadata timestamps, shadow angles, weather data, and historical records. It helps identify content that has been backdated or misdated.',
    category: 'features',
    tags: ['timeline', 'date', 'chronology'],
  },
  {
    id: 'ft-8',
    question: 'How does fact-checking work?',
    answer:
      'Our fact-checking tool extracts text and claims from media, then cross-references them with trusted news sources, fact-checking databases, and verified information. Results include source citations and credibility ratings.',
    category: 'features',
    tags: ['fact-check', 'claims', 'verification'],
  },
  {
    id: 'ft-9',
    question: 'Can I export verification reports?',
    answer:
      'Yes! Reports can be exported as PDF (formatted for sharing), JSON (for programmatic access), or CSV (for data analysis). Exports include all verification results, metadata, and visual evidence.',
    category: 'features',
    tags: ['export', 'reports', 'pdf'],
  },
  {
    id: 'ft-10',
    question: 'What is keyframe extraction?',
    answer:
      'Keyframe extraction automatically identifies and extracts the most important frames from videos. This is useful for analyzing long videos, creating thumbnails, or focusing verification on specific moments.',
    category: 'features',
    tags: ['keyframe', 'video', 'extraction'],
  },
  {
    id: 'ft-11',
    question: 'How do I use the claim research tool?',
    answer:
      'The claim research tool helps you investigate specific claims by searching across multiple sources, analyzing credibility, and providing context. Simply enter the claim text, and the tool will gather relevant information and fact-checks.',
    category: 'features',
    tags: ['claims', 'research', 'investigation'],
  },
  {
    id: 'ft-12',
    question: 'Can I save verification results for later?',
    answer:
      "All verification results are automatically saved to your Library. You can organize them with tags, add notes, and access them anytime. Results are retained according to your plan's data retention policy.",
    category: 'features',
    tags: ['save', 'library', 'storage'],
  },

  // Account & Billing
  {
    id: 'ab-1',
    question: 'How do I upgrade my plan?',
    answer:
      'Go to Settings > Subscription and click "Upgrade Plan". Choose your desired plan, enter payment details, and confirm. Upgrades take effect immediately, and you\'ll be prorated for the current billing period.',
    category: 'account',
    tags: ['upgrade', 'plan', 'subscription'],
  },
  {
    id: 'ab-2',
    question: 'What are the usage limits?',
    answer:
      'Limits vary by plan: Free (10 verifications/month), Pro (500/month), Team (2000/month), Enterprise (unlimited). File size limits are 100MB (Free), 500MB (Pro/Team), 2GB (Enterprise). Check your dashboard for current usage.',
    category: 'account',
    tags: ['limits', 'quota', 'usage'],
  },
  {
    id: 'ab-3',
    question: 'How do I add team members?',
    answer:
      'In Settings > Team, click "Invite Member", enter their email, and assign a role (Admin, Editor, or Viewer). They\'ll receive an invitation email. Team plans support up to 10 members; Enterprise plans have no limit.',
    category: 'account',
    tags: ['team', 'members', 'collaboration'],
  },
  {
    id: 'ab-4',
    question: 'Can I get a refund?',
    answer:
      'We offer a 14-day money-back guarantee for annual plans. Monthly plans are non-refundable but can be cancelled anytime. Contact support@safeguardmedia.com with your request and reason.',
    category: 'account',
    tags: ['refund', 'cancellation', 'billing'],
  },
  {
    id: 'ab-5',
    question: 'How do I cancel my subscription?',
    answer:
      'Go to Settings > Subscription and click "Cancel Subscription". Your access continues until the end of the current billing period. You can reactivate anytime without losing your data.',
    category: 'account',
    tags: ['cancel', 'subscription', 'billing'],
  },
  {
    id: 'ab-6',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, Amex, Discover), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through Stripe.',
    category: 'account',
    tags: ['payment', 'billing', 'methods'],
  },

  // Troubleshooting
  {
    id: 'ts-1',
    question: 'Why is my upload failing?',
    answer:
      'Common causes: 1) File too large (check plan limits), 2) Unsupported format, 3) Corrupted file, 4) Network issues. Try: reducing file size, converting format, re-downloading the file, or checking your internet connection.',
    category: 'troubleshooting',
    tags: ['upload', 'error', 'failure'],
  },
  {
    id: 'ts-2',
    question: 'Why is processing taking so long?',
    answer:
      'Large files, high server load, or complex analysis can slow processing. Videos over 100MB may take 5-10 minutes. If processing exceeds 15 minutes, refresh the page or contact support.',
    category: 'troubleshooting',
    tags: ['slow', 'processing', 'performance'],
  },
  {
    id: 'ts-3',
    question: 'How do I fix authentication errors?',
    answer:
      'Try: 1) Logging out and back in, 2) Clearing browser cache and cookies, 3) Trying a different browser, 4) Resetting your password. If issues persist, contact support with the error message.',
    category: 'troubleshooting',
    tags: ['authentication', 'login', 'error'],
  },
  {
    id: 'ts-4',
    question: 'What if results seem incorrect?',
    answer:
      "AI systems aren't perfect. If results seem wrong: 1) Check the confidence score, 2) Try a higher quality file, 3) Use multiple verification tools, 4) Review the detailed analysis, 5) Contact support for expert review.",
    category: 'troubleshooting',
    tags: ['incorrect', 'wrong', 'accuracy'],
  },
  {
    id: 'ts-5',
    question: "Why can't I see my verification history?",
    answer:
      "Check: 1) You're logged into the correct account, 2) Filters aren't hiding results, 3) Results weren't deleted. Free plan history is limited to 30 days. Contact support if data is missing.",
    category: 'troubleshooting',
    tags: ['history', 'library', 'missing'],
  },
  {
    id: 'ts-6',
    question: 'The dashboard is loading slowly',
    answer:
      'Try: 1) Clearing browser cache, 2) Disabling browser extensions, 3) Using a modern browser (Chrome, Firefox, Safari, Edge), 4) Checking your internet speed. Contact support if issues persist.',
    category: 'troubleshooting',
    tags: ['slow', 'performance', 'dashboard'],
  },
  {
    id: 'ts-7',
    question: 'I\'m getting a "quota exceeded" error',
    answer:
      "You've reached your plan's monthly verification limit. Options: 1) Wait until next billing cycle, 2) Upgrade your plan, 3) Purchase additional credits (contact sales). Check Settings > Usage for details.",
    category: 'troubleshooting',
    tags: ['quota', 'limit', 'exceeded'],
  },
  {
    id: 'ts-8',
    question: 'Why is the video player not working?',
    answer:
      'Ensure your browser supports HTML5 video. Try: 1) Updating your browser, 2) Enabling JavaScript, 3) Disabling ad blockers, 4) Trying a different browser. Some formats may require transcoding.',
    category: 'troubleshooting',
    tags: ['video', 'player', 'playback'],
  },
  {
    id: 'ts-9',
    question: 'I forgot my password',
    answer:
      'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox. Check spam if you don\'t receive it within 5 minutes. Contact support if issues persist.',
    category: 'troubleshooting',
    tags: ['password', 'reset', 'login'],
  },
  {
    id: 'ts-10',
    question: 'How do I report a bug?',
    answer:
      'Use the "Report Bug" button in the support section or email bugs@safeguardmedia.com. Include: 1) Description of the issue, 2) Steps to reproduce, 3) Screenshots if applicable, 4) Browser and OS version.',
    category: 'troubleshooting',
    tags: ['bug', 'report', 'issue'],
  },

  // API & Integration
  {
    id: 'api-1',
    question: 'How do I get API access?',
    answer:
      'API access is available on Pro plans and above. Go to Settings > API, click "Generate API Key", and follow the setup instructions. Documentation is available at docs.safeguardmedia.com/api.',
    category: 'api',
    tags: ['api', 'access', 'key'],
  },
  {
    id: 'api-2',
    question: 'What are the API rate limits?',
    answer:
      'Rate limits vary by plan: Pro (100 requests/hour), Team (500/hour), Enterprise (custom). Limits reset hourly. Exceeding limits returns a 429 error. Contact sales for higher limits.',
    category: 'api',
    tags: ['rate', 'limits', 'api'],
  },
  {
    id: 'api-3',
    question: 'Where is the API documentation?',
    answer:
      'Full API documentation is available at docs.safeguardmedia.com/api. It includes endpoints, authentication, request/response examples, SDKs, and code samples in multiple languages.',
    category: 'api',
    tags: ['documentation', 'api', 'docs'],
  },
  {
    id: 'api-4',
    question: 'How do I authenticate API requests?',
    answer:
      'Use Bearer token authentication. Include your API key in the Authorization header: "Authorization: Bearer YOUR_API_KEY". Never expose your API key in client-side code.',
    category: 'api',
    tags: ['authentication', 'api', 'security'],
  },
  {
    id: 'api-5',
    question: 'Can I use webhooks for notifications?',
    answer:
      "Yes! Configure webhooks in Settings > API > Webhooks. We'll send POST requests to your endpoint when verifications complete, with results in the payload. Supports retry logic and signature verification.",
    category: 'api',
    tags: ['webhooks', 'notifications', 'api'],
  },
  {
    id: 'api-6',
    question: 'Are there SDKs available?',
    answer:
      'Yes! We provide official SDKs for Python, JavaScript/Node.js, and Ruby. Community SDKs exist for PHP, Go, and Java. All SDKs are open-source on GitHub.',
    category: 'api',
    tags: ['sdk', 'libraries', 'api'],
  },
  {
    id: 'api-7',
    question: 'How do I handle API errors?',
    answer:
      'API errors return standard HTTP status codes with JSON error details. Implement retry logic with exponential backoff for 5xx errors. Check error.code and error.message for specifics. See docs for error reference.',
    category: 'api',
    tags: ['errors', 'api', 'troubleshooting'],
  },

  // Privacy & Security
  {
    id: 'ps-1',
    question: 'How is my data stored?',
    answer:
      'All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Files are stored in secure, redundant cloud storage with geographic distribution. We use industry-standard security practices.',
    category: 'privacy',
    tags: ['storage', 'security', 'encryption'],
  },
  {
    id: 'ps-2',
    question: 'Is my data encrypted?',
    answer:
      'Yes! All data is encrypted both at rest (AES-256) and in transit (TLS 1.3). API keys are hashed, passwords are salted and hashed with bcrypt, and sensitive metadata is encrypted.',
    category: 'privacy',
    tags: ['encryption', 'security', 'data'],
  },
  {
    id: 'ps-3',
    question: 'How long do you keep my data?',
    answer:
      'Retention varies by plan: Free (30 days), Pro (1 year), Team (2 years), Enterprise (custom). You can delete data anytime. After retention period, data is permanently deleted within 30 days.',
    category: 'privacy',
    tags: ['retention', 'data', 'storage'],
  },
  {
    id: 'ps-4',
    question: 'Are you GDPR compliant?',
    answer:
      "Yes! We're fully GDPR compliant. You have rights to access, rectify, erase, and port your data. We have a Data Protection Officer and conduct regular audits. See our Privacy Policy for details.",
    category: 'privacy',
    tags: ['gdpr', 'compliance', 'privacy'],
  },
  {
    id: 'ps-5',
    question: 'Who can see my verification results?',
    answer:
      "Only you and team members you invite can see your results. We don't share data with third parties except as required by law. Enterprise plans can configure custom access controls.",
    category: 'privacy',
    tags: ['privacy', 'access', 'sharing'],
  },
];
