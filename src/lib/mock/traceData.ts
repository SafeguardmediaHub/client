import type { TraceResult, TraceStatusResponse } from '@/types/trace';

/**
 * Mock data for Trump assassination attempt trace (July 13, 2024)
 * Used for demo/presentation purposes
 */

const MOCK_TRACE_ID = 'demo-trace-trump-2024';
const EVENT_DATE = '2024-07-13';

export const getMockTraceResult = (
  mediaId: string,
  traceId: string
): TraceResult => {
  return {
    traceId,
    mediaId,
    status: 'completed',
    searchConfig: {
      platforms: ['twitter', 'facebook', 'instagram', 'tiktok'],
      searchDepth: 3,
      maxResults: 500,
      includeDeleted: false,
    },
    createdAt: `${EVENT_DATE}T18:11:00.000Z`,
    completedAt: `${EVENT_DATE}T18:15:30.000Z`,
    platformAppearances: [
      {
        platform: 'twitter',
        posts: [
          {
            postId: 'tweet-001',
            userId: 'realDonaldTrump',
            username: 'realDonaldTrump',
            displayName: 'Donald J. Trump',
            platform: 'twitter',
            timestamp: `${EVENT_DATE}T18:12:34.000Z`,
            url: 'https://twitter.com/realDonaldTrump/status/001',
            engagement: {
              likes: 2847000,
              shares: 891000,
              retweets: 891000,
              comments: 234000,
              replies: 234000,
              views: 15600000,
              reactions: 2847000,
            },
            hashtags: ['Trump', 'Pennsylvania', 'Rally', 'Breaking'],
            mentions: ['@SecretService', '@GOP'],
            caption:
              'I was shot with a bullet that pierced the upper part of my right ear. Much bleeding took place. GOD BLESS AMERICA!',
            isVerified: true,
            spreadType: 'original',
          },
          {
            postId: 'tweet-002',
            userId: 'EvanVucci_AP',
            username: 'EvanVucci',
            displayName: 'Evan Vucci',
            platform: 'twitter',
            timestamp: `${EVENT_DATE}T18:14:22.000Z`,
            url: 'https://twitter.com/EvanVucci/status/002',
            engagement: {
              likes: 1240000,
              shares: 523000,
              retweets: 523000,
              comments: 89000,
              replies: 89000,
              views: 8900000,
              reactions: 1240000,
            },
            hashtags: ['TrumpRally', 'Pennsylvania', 'BreakingNews'],
            mentions: [],
            caption: 'BREAKING: Secret Service agents rush to protect former President Trump after shots fired at Pennsylvania rally.',
            isVerified: true,
            spreadType: 'repost',
          },
          {
            postId: 'tweet-003',
            userId: 'AP',
            username: 'AP',
            displayName: 'The Associated Press',
            platform: 'twitter',
            timestamp: `${EVENT_DATE}T18:15:01.000Z`,
            url: 'https://twitter.com/AP/status/003',
            engagement: {
              likes: 987000,
              shares: 412000,
              retweets: 412000,
              comments: 67000,
              replies: 67000,
              views: 6700000,
              reactions: 987000,
            },
            hashtags: ['Breaking', 'TrumpRally'],
            mentions: ['@realDonaldTrump'],
            caption: 'BREAKING: Former President Donald Trump is safe after what law enforcement is investigating as an assassination attempt.',
            isVerified: true,
            spreadType: 'repost',
          },
        ],
        totalFound: 234567,
        oldestPost: `${EVENT_DATE}T18:12:34.000Z`,
        newestPost: `${EVENT_DATE}T23:59:59.000Z`,
      },
      {
        platform: 'facebook',
        posts: [
          {
            postId: 'fb-001',
            userId: 'DonaldTrump',
            username: 'DonaldTrump',
            displayName: 'Donald J. Trump',
            platform: 'facebook',
            timestamp: `${EVENT_DATE}T18:18:45.000Z`,
            url: 'https://facebook.com/DonaldTrump/posts/001',
            engagement: {
              likes: 1890000,
              shares: 456000,
              retweets: 0,
              comments: 189000,
              replies: 189000,
              views: 12400000,
              reactions: 1890000,
            },
            hashtags: ['Trump2024', 'Pennsylvania'],
            mentions: [],
            caption: 'Thank you to everyone for your thoughts and prayers. I am fine and grateful to our brave Secret Service.',
            isVerified: true,
            spreadType: 'original',
          },
          {
            postId: 'fb-002',
            userId: 'FoxNews',
            username: 'FoxNews',
            displayName: 'Fox News',
            platform: 'facebook',
            timestamp: `${EVENT_DATE}T18:16:12.000Z`,
            url: 'https://facebook.com/FoxNews/posts/002',
            engagement: {
              likes: 567000,
              shares: 234000,
              retweets: 0,
              comments: 89000,
              replies: 89000,
              views: 4500000,
              reactions: 567000,
            },
            hashtags: ['BreakingNews', 'Trump'],
            mentions: [],
            caption: 'BREAKING: Multiple shots fired at Trump rally in Pennsylvania. Former president escorted off stage by Secret Service.',
            isVerified: true,
            spreadType: 'repost',
          },
        ],
        totalFound: 89432,
        oldestPost: `${EVENT_DATE}T18:16:12.000Z`,
        newestPost: `${EVENT_DATE}T23:55:30.000Z`,
      },
      {
        platform: 'instagram',
        posts: [
          {
            postId: 'ig-001',
            userId: 'realdonaldtrump',
            username: 'realdonaldtrump',
            displayName: 'President Donald J. Trump',
            platform: 'instagram',
            timestamp: `${EVENT_DATE}T18:25:30.000Z`,
            url: 'https://instagram.com/p/ig001',
            engagement: {
              likes: 3400000,
              shares: 0,
              retweets: 0,
              comments: 456000,
              replies: 456000,
              views: 18900000,
              reactions: 3400000,
            },
            hashtags: ['Trump', 'MAGA', 'Pennsylvania'],
            mentions: [],
            caption: 'I will NEVER SURRENDER! 🇺🇸',
            isVerified: true,
            spreadType: 'original',
          },
        ],
        totalFound: 45678,
        oldestPost: `${EVENT_DATE}T18:25:30.000Z`,
        newestPost: `${EVENT_DATE}T23:45:00.000Z`,
      },
      {
        platform: 'tiktok',
        posts: [
          {
            postId: 'tiktok-001',
            userId: 'newsbreaking',
            username: 'newsbreaking',
            displayName: 'Breaking News Today',
            platform: 'tiktok',
            timestamp: `${EVENT_DATE}T18:20:15.000Z`,
            url: 'https://tiktok.com/@newsbreaking/video/001',
            engagement: {
              likes: 8900000,
              shares: 2340000,
              retweets: 0,
              comments: 567000,
              replies: 567000,
              views: 45600000,
              reactions: 8900000,
            },
            hashtags: ['Trump', 'BreakingNews', 'Pennsylvania', 'Viral'],
            mentions: [],
            caption: '🚨 BREAKING: Trump rally shooting in Pennsylvania #breaking #trump #news',
            isVerified: true,
            spreadType: 'repost',
          },
        ],
        totalFound: 123456,
        oldestPost: `${EVENT_DATE}T18:20:15.000Z`,
        newestPost: `${EVENT_DATE}T23:59:00.000Z`,
      },
    ],
    distributionGraph: {
      originalPoster: {
        postId: 'tweet-001',
        userId: 'realDonaldTrump',
        username: 'realDonaldTrump',
        displayName: 'Donald J. Trump',
        platform: 'twitter',
        timestamp: `${EVENT_DATE}T18:12:34.000Z`,
        url: 'https://twitter.com/realDonaldTrump/status/001',
        verified: true,
        engagement: {
          likes: 2847000,
          shares: 891000,
          comments: 234000,
          views: 15600000,
        },
      },
      earlySpreaders: [
        {
          postId: 'tweet-002',
          userId: 'EvanVucci_AP',
          username: 'EvanVucci',
          displayName: 'Evan Vucci (AP)',
          platform: 'twitter',
          timestamp: `${EVENT_DATE}T18:14:22.000Z`,
          url: 'https://twitter.com/EvanVucci/status/002',
          verified: true,
          timeFromOriginal: 108000,
          engagement: {
            likes: 1240000,
            shares: 523000,
            comments: 89000,
            views: 8900000,
          },
          isInfluencer: true,
          influenceScore: 95,
        },
        {
          postId: 'tweet-003',
          userId: 'AP',
          username: 'AP',
          displayName: 'The Associated Press',
          platform: 'twitter',
          timestamp: `${EVENT_DATE}T18:15:01.000Z`,
          url: 'https://twitter.com/AP/status/003',
          verified: true,
          timeFromOriginal: 147000,
          engagement: {
            likes: 987000,
            shares: 412000,
            comments: 67000,
            views: 6700000,
          },
          isInfluencer: true,
          influenceScore: 98,
        },
        {
          postId: 'tweet-004',
          userId: 'FoxNews',
          username: 'FoxNews',
          displayName: 'Fox News',
          platform: 'twitter',
          timestamp: `${EVENT_DATE}T18:16:45.000Z`,
          url: 'https://twitter.com/FoxNews/status/004',
          verified: true,
          timeFromOriginal: 251000,
          engagement: {
            likes: 789000,
            shares: 345000,
            comments: 56000,
            views: 5600000,
          },
          isInfluencer: true,
          influenceScore: 92,
        },
      ],
      viralMoments: [
        {
          platform: 'twitter',
          timestamp: `${EVENT_DATE}T18:20:00.000Z`,
          description:
            'Massive viral spike as major news outlets and political figures share the incident',
          engagementSpike: 45.8,
          shareVelocity: 89000,
          totalShares: 1234000,
        },
        {
          platform: 'tiktok',
          timestamp: `${EVENT_DATE}T19:15:00.000Z`,
          description:
            'TikTok explosion - video footage goes viral with 45M+ views in first hour',
          engagementSpike: 127.3,
          shareVelocity: 234000,
          totalShares: 2340000,
        },
        {
          platform: 'facebook',
          timestamp: `${EVENT_DATE}T18:45:00.000Z`,
          description:
            'Facebook reaches peak sharing velocity as international media picks up the story',
          engagementSpike: 32.1,
          shareVelocity: 45600,
          totalShares: 456000,
        },
      ],
      totalPosts: 493133,
      totalEngagement: 89456789,
      spreadDurationHours: 5.8,
      peakVelocity: 234000,
      platformBreakdown: [
        {
          platform: 'twitter',
          postCount: 234567,
          engagementTotal: 45678900,
          percentage: 47.6,
        },
        {
          platform: 'tiktok',
          postCount: 123456,
          engagementTotal: 23456789,
          percentage: 25.0,
        },
        {
          platform: 'facebook',
          postCount: 89432,
          engagementTotal: 15678900,
          percentage: 18.1,
        },
        {
          platform: 'instagram',
          postCount: 45678,
          engagementTotal: 4642200,
          percentage: 9.3,
        },
      ],
    },
    suspiciousPatterns: {
      coordinatedBehavior: {
        detected: true,
        score: 0.72,
        accountsInvolved: [
          'bot_account_1',
          'bot_account_2',
          'bot_account_3',
          'coordinated_group_001',
        ],
        timingClusters: [
          { timestamp: `${EVENT_DATE}T18:25:00.000Z`, accountCount: 234 },
          { timestamp: `${EVENT_DATE}T19:10:00.000Z`, accountCount: 189 },
        ],
        similarityScore: 0.68,
      },
      botAmplification: {
        detected: true,
        score: 0.65,
        suspiciousAccounts: [
          'bot_news_001',
          'bot_news_002',
          'auto_share_bot_123',
          'spam_account_456',
        ],
        botProbability: 0.78,
        indicators: [
          'High posting frequency',
          'Similar content patterns',
          'Automated timestamps',
          'Newly created accounts',
        ],
      },
      rapidSpread: {
        detected: true,
        spreadRate: 85000,
        score: 0.89,
        organicLikelihood: 0.45,
        accelerationPoints: [
          { timestamp: `${EVENT_DATE}T18:15:00.000Z`, velocity: 45000 },
          { timestamp: `${EVENT_DATE}T18:30:00.000Z`, velocity: 125000 },
          { timestamp: `${EVENT_DATE}T19:00:00.000Z`, velocity: 234000 },
        ],
        timeline: [
          { hour: 0, postCount: 1234 },
          { hour: 1, postCount: 45678 },
          { hour: 2, postCount: 123456 },
          { hour: 3, postCount: 234567 },
          { hour: 4, postCount: 345678 },
          { hour: 5, postCount: 456789 },
        ],
      },
      overallSuspicionScore: 0.75,
      riskLevel: 'high',
      flags: [
        'Coordinated amplification detected',
        'Bot network involvement',
        'Unusually rapid spread',
        'Multiple suspicious accounts',
      ],
    },
    forensicAnalysis: {
      status: 'completed',
      startedAt: `${EVENT_DATE}T18:11:00.000Z`,
      completedAt: `${EVENT_DATE}T18:15:30.000Z`,
      processingTimeSeconds: 270,
      tracingScore: 0.94,
      confidence: 0.91,
      flags: [
        'Original source confirmed',
        'Authentic event documentation',
        'Widespread media verification',
      ],
      summary:
        'Comprehensive trace completed successfully. The content originated from an authentic event - assassination attempt at Trump rally in Butler, Pennsylvania on July 13, 2024. High confidence in source authenticity and distribution pattern. Detected significant bot amplification and coordinated sharing behavior, typical for major breaking news events. Content spread virally across all major platforms within minutes, reaching 89M+ engagements in under 6 hours.',
      recommendations: [
        'Monitor for misinformation variants and doctored versions',
        'Track bot networks identified during trace for future activity',
        'Cross-reference with official law enforcement statements',
        'Flag suspicious accounts for platform review',
        'Continue monitoring spread patterns for unusual activity',
      ],
    },
  };
};

export const getMockTraceStatus = (
  traceId: string,
  stage: 'pending' | 'processing' | 'completed' = 'processing'
): TraceStatusResponse => {
  if (stage === 'completed') {
    return {
      success: true,
      data: {
        traceId,
        status: 'completed',
        progress: {
          stage: 'forensics',
          percentage: 100,
          platformsSearched: 4,
          totalPlatforms: 4,
          postsFound: 493133,
          estimatedTimeRemaining: 0,
        },
      },
      message: 'Trace completed successfully',
    };
  }

  if (stage === 'processing') {
    return {
      success: true,
      data: {
        traceId,
        status: 'processing',
        progress: {
          stage: 'analysis',
          percentage: 65,
          platformsSearched: 3,
          totalPlatforms: 4,
          postsFound: 245678,
          estimatedTimeRemaining: 45,
        },
      },
      message: 'Trace in progress',
    };
  }

  return {
    success: true,
    data: {
      traceId,
      status: 'pending',
      progress: {
        stage: 'discovery',
        percentage: 5,
        platformsSearched: 0,
        totalPlatforms: 4,
        postsFound: 0,
        estimatedTimeRemaining: 120,
      },
    },
    message: 'Trace queued',
  };
};
