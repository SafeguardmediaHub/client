import { ArrowLeft, Check } from 'lucide-react';
import React from 'react';
import type { Media } from '@/hooks/useMedia';
import { VerifyTimelineResponse } from '../hooks/useTimeline';
import { Button } from './ui/button';

interface DistributionItem {
  platform: string;
  badge: 'Original Source' | 'Repost' | 'Modified';
  badgeColor: string;
  matchPercentage: string;
  title: string;
  publishedDate: string;
}

const searchEngines = [
  { name: 'Google Images', checked: true },
  { name: 'Bing Visual Search', checked: true },
  { name: 'TinEye', checked: true },
  { name: 'Yandex', checked: true },
];

const distributionItems: DistributionItem[] = [
  {
    platform: 'Reuters',
    badge: 'Original Source',
    badgeColor: 'bg-green-100 text-green-700 border-green-200',
    matchPercentage: '100% match',
    title: 'Breaking: Political Rally Coverage',
    publishedDate: '2023-08-2015',
  },
  {
    platform: 'Twitter',
    badge: 'Repost',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    matchPercentage: '87% match',
    title: 'Viral political moment captured',
    publishedDate: '2023-08-2015',
  },
  {
    platform: 'Facebook',
    badge: 'Modified',
    badgeColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    matchPercentage: '80% match',
    title: 'SHOCKING: See what happened at rally',
    publishedDate: '2023-08-2015',
  },
  {
    platform: 'Instagram',
    badge: 'Repost',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    matchPercentage: '100% match',
    title: 'Rally highlights compilation',
    publishedDate: '2023-08-2017',
  },
];

const TimelineResult = ({
  data,
  media,
}: {
  data: any;
  media: Media | null;
}) => {
  console.log('TimelineResult data:', data);

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-gray-500 flex text-sm items-center gap-1 hover:underline hover:cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Home
          </span>
          <h1 className="text-2xl my-4">{media?.filename}</h1>
        </div>
        <Button variant="outline">Re-search</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex gap-6">
            <img
              src={media?.thumbnailUrl}
              alt={media?.filename}
              className="w-64 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Original Source
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">First Published</span>
                  <span className="text-gray-900 font-medium">2023-08-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source</span>
                  <span className="text-gray-900 font-medium">Reuters</span>
                </div>
              </div>
              <Button className="mt-6 w-full px-4 py-2 border border-gray-300  rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View Original Source
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Search Completed
            </h3>
            <p className="text-gray-600 text-sm">
              Found 47 matches across 4 search engines.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Search Coverage
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {searchEngines.map((engine) => (
                <div key={engine.name} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{engine.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl text-gray-900 mb-2 font-medium [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
          Distribution Timeline
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          7 total identical or similar copies of the media were found.
        </p>

        <div className="space-y-4">
          {distributionItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg text-gray-900">{item.platform}</h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    {item.matchPercentage}
                  </span>
                </div>
              </div>

              <p className="text-gray-500 mb-4">{item.title}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Published: {item.publishedDate}
                </span>
                <Button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View Source
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Load More
          </Button>
        </div>
      </div>
      {JSON.stringify(media?.timeline, null, 2)}

      {JSON.stringify(media, null, 2)}
    </div>
  );
};

export default TimelineResult;
