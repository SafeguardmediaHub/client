import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Media, useGetMedia } from "@/hooks/useMedia";
import { formatFileSize } from "@/lib/utils";

interface MediaSelectorProps {
  onSelect: (media: Media) => void;
}

const MediaSelector = ({ onSelect }: MediaSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isError, isLoading, refetch } = useGetMedia();
  // Memoize media array to prevent creating new array reference on every render
  const media = useMemo(() => data?.media || [], [data?.media]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = media.filter((item) =>
        item.filename.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredMedia(filtered);
    } else {
      setFilteredMedia(media);
    }
  }, [searchQuery, media]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(item: Media) {
    setSelectedMedia(item);
    setIsOpen(false);
    onSelect(item);
  }

  const formatDate = (date: Date | string) => {
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        <span className="text-gray-500">
          {selectedMedia
            ? selectedMedia.filename
            : "Select a media file to verify"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[600px] flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by filename or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading media files...
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No media files found
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredMedia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {item.filename}
                        </p>
                        {selectedMedia?.id === item.id && (
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      {/* <p className="text-sm text-gray-500 truncate mb-1">
                        {item.original_source}
                      </p> */}
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{formatFileSize(Number(item.fileSize))}</span>
                        <span>{formatDate(item.uploadedAt)}</span>
                        {/* <span>{item.similar_copies} similar copies</span> */}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSelector;
