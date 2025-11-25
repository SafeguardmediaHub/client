'use client';

import { CalendarIcon, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { MediaType, VerificationStatus, VerificationsListParams } from '@/types/c2pa';

interface VerificationFiltersProps {
  filters: VerificationsListParams;
  onFiltersChange: (filters: VerificationsListParams) => void;
  className?: string;
}

const statusOptions: { value: VerificationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'verified', label: 'Verified' },
  { value: 'tampered', label: 'Tampered' },
  { value: 'invalid_signature', label: 'Invalid Signature' },
  { value: 'no_c2pa', label: 'No C2PA' },
  { value: 'processing', label: 'Processing' },
  { value: 'error', label: 'Error' },
];

const mediaTypeOptions: { value: MediaType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Documents' },
];

export function VerificationFilters({
  filters,
  onFiltersChange,
  className,
}: VerificationFiltersProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  });

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'all' ? undefined : (value as VerificationStatus),
      page: 1,
    });
  };

  const handleMediaTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      mediaType: value === 'all' ? undefined : (value as MediaType),
      page: 1,
    });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1,
    });
  };

  const handleDateSelect = (range: { from: Date | undefined; to?: Date | undefined } | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });
    onFiltersChange({
      ...filters,
      startDate: range?.from?.toISOString().split('T')[0],
      endDate: range?.to?.toISOString().split('T')[0],
      page: 1,
    });
  };

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined });
    onFiltersChange({
      page: 1,
      limit: filters.limit,
    });
  };

  const hasFilters =
    filters.status ||
    filters.mediaType ||
    filters.search ||
    filters.startDate ||
    filters.endDate;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl',
        className
      )}
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          placeholder="Search by file name or ID..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 h-10 bg-white"
        />
      </div>

      {/* Status filter */}
      <Select
        value={filters.status || 'all'}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[160px] h-10 bg-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Media type filter */}
      <Select
        value={filters.mediaType || 'all'}
        onValueChange={handleMediaTypeChange}
      >
        <SelectTrigger className="w-[140px] h-10 bg-white">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {mediaTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date range picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'h-10 px-3 bg-white justify-start text-left font-normal',
              !dateRange.from && 'text-gray-500'
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {dateRange.from.toLocaleDateString()} -{' '}
                  {dateRange.to.toLocaleDateString()}
                </>
              ) : (
                dateRange.from.toLocaleDateString()
              )
            ) : (
              'Date Range'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Reset button */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-10 text-gray-500 hover:text-gray-700"
        >
          <RotateCcw className="size-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
