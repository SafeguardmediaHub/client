"use client";

import {
  BadgeCheck,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Globe,
  Users,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Platform, PlatformAppearance } from "@/types/trace";

interface PostsListTabProps {
  posts: PlatformAppearance[];
}

const getPlatformColor = (platform: Platform) => {
  const colors: Record<Platform, string> = {
    twitter: "bg-sky-100 text-sky-700 border-sky-200",
    facebook: "bg-blue-100 text-blue-700 border-blue-200",
    instagram: "bg-pink-100 text-pink-700 border-pink-200",
    tiktok: "bg-purple-100 text-purple-700 border-purple-200",
    youtube: "bg-red-100 text-red-700 border-red-200",
    reddit: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return colors[platform] || "bg-gray-100 text-gray-700 border-gray-200";
};

const POSTS_PER_PAGE = 10;

export const PostsListTab = ({ posts }: PostsListTabProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Group posts by platform
  const platformGroups = posts.reduce(
    (acc, post) => {
      if (!acc[post.platform]) {
        acc[post.platform] = [];
      }
      acc[post.platform].push(post);
      return acc;
    },
    {} as Record<Platform, PlatformAppearance[]>,
  );

  const platforms = Object.keys(platformGroups) as Platform[];

  // Filter posts by selected platform
  const filteredPosts =
    selectedPlatform === "all"
      ? posts
      : platformGroups[selectedPlatform] || [];

  // Paginate
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  );

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Platform Filter */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPlatform === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedPlatform("all");
              setCurrentPage(1);
            }}
            className="cursor-pointer"
          >
            All Platforms ({posts.length})
          </Button>
          {platforms.map((platform) => (
            <Button
              key={platform}
              variant={selectedPlatform === platform ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedPlatform(platform);
                setCurrentPage(1);
              }}
              className={cn(
                "cursor-pointer capitalize",
                selectedPlatform === platform && getPlatformColor(platform),
              )}
            >
              {platform} ({platformGroups[platform].length})
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Posts</div>
          <div className="text-2xl font-bold text-gray-900">
            {filteredPosts.length}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Likes</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(
              filteredPosts.reduce((sum, p) => sum + p.engagement.likes, 0),
            )}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Shares</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(
              filteredPosts.reduce((sum, p) => sum + p.engagement.shares, 0),
            )}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Comments</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(
              filteredPosts.reduce((sum, p) => sum + p.engagement.comments, 0),
            )}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {paginatedPosts.map((post) => (
          <div
            key={post.postId}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {post.displayName || post.username}
                    </span>
                    {post.metadata?.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>@{post.username}</span>
                    <span>•</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs border capitalize",
                        getPlatformColor(post.platform),
                      )}
                    >
                      {post.platform}
                    </Badge>
                  </div>
                </div>
              </div>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Post Content */}
            {post.content && (
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
            )}

            {/* Post Metadata */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.timestamp)}</span>
              </div>
              {post.metadata?.followerCount && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{formatNumber(post.metadata.followerCount)} followers</span>
                </div>
              )}
              {post.metadata?.accountCreated && (
                <div className="flex items-center gap-1 text-xs">
                  Account created:{" "}
                  {new Date(post.metadata.accountCreated).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Engagement Metrics */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="w-5 h-5" />
                <span className="font-medium">
                  {formatNumber(post.engagement.likes)}
                </span>
                <span className="text-sm">Likes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">
                  {formatNumber(post.engagement.shares)}
                </span>
                <span className="text-sm">Shares</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">
                  {formatNumber(post.engagement.comments)}
                </span>
                <span className="text-sm">Comments</span>
              </div>
              {post.engagement.views !== undefined && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">
                    {formatNumber(post.engagement.views)}
                  </span>
                  <span className="text-sm">Views</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + POSTS_PER_PAGE, filteredPosts.length)} of{" "}
            {filteredPosts.length} posts
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="cursor-pointer w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
