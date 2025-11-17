"use client";

import { AlertCircle, Globe, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DistributionGraph, Platform } from "@/types/trace";

interface DistributionGraphTabProps {
  graph: DistributionGraph;
}

const getPlatformColor = (platform: Platform) => {
  const colors: Record<Platform, string> = {
    twitter: "bg-sky-500",
    facebook: "bg-blue-500",
    instagram: "bg-pink-500",
    tiktok: "bg-purple-500",
    youtube: "bg-red-500",
    reddit: "bg-orange-500",
  };
  return colors[platform] || "bg-gray-500";
};

export const DistributionGraphTab = ({ graph }: DistributionGraphTabProps) => {
  if (graph.nodes.length === 0) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Distribution Data
        </h3>
        <p className="text-sm text-gray-600">
          Not enough data to generate a distribution graph.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Graph Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Nodes</div>
          <div className="text-2xl font-bold text-gray-900">
            {graph.metadata.totalNodes}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Connections</div>
          <div className="text-2xl font-bold text-gray-900">
            {graph.metadata.totalEdges}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Platforms</div>
          <div className="text-2xl font-bold text-gray-900">
            {graph.metadata.platforms.length}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Avg. Connections</div>
          <div className="text-2xl font-bold text-gray-900">
            {(graph.metadata.totalEdges / graph.metadata.totalNodes).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Placeholder for Graph Visualization */}
      <div className="p-8 bg-white border border-gray-200 rounded-lg">
        <div className="text-center mb-8">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Distribution Graph Visualization
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Interactive graph visualization will be implemented with Visx/D3 in
            the next iteration.
          </p>
          <div className="inline-block p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <p className="text-sm text-blue-800">
              <strong>Planned Features:</strong>
              <br />
              • Force-directed graph layout
              <br />
              • Interactive node exploration
              <br />
              • Platform-based color coding
              <br />
              • Zoom and pan capabilities
              <br />
              • Node clustering for large graphs (&gt;2k nodes)
              <br />
            </p>
          </div>
        </div>
      </div>

      {/* Platform Legend */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Platform Legend
        </h3>
        <div className="flex flex-wrap gap-3">
          {graph.metadata.platforms.map((platform) => (
            <div key={platform} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${getPlatformColor(platform)}`}
              />
              <span className="text-sm text-gray-700 capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Nodes */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Nodes (by engagement)
        </h3>
        <div className="space-y-3">
          {graph.nodes
            .sort(
              (a, b) =>
                b.engagement.likes +
                b.engagement.shares +
                b.engagement.comments -
                (a.engagement.likes +
                  a.engagement.shares +
                  a.engagement.comments),
            )
            .slice(0, 10)
            .map((node) => (
              <div
                key={node.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getPlatformColor(node.platform)}`}
                    />
                    <span className="font-medium text-gray-900">
                      {node.username}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {node.type}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {node.platform}
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>{node.engagement.likes} likes</span>
                  <span>{node.engagement.shares} shares</span>
                  <span>{node.engagement.comments} comments</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Edge Types */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Connection Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["shared", "reposted", "quoted", "replied"].map((type) => {
            const count = graph.edges.filter((e) => e.type === type).length;
            return (
              <div key={type} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1 capitalize">
                  {type}
                </div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
