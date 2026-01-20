'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserType } from '@/lib/api/waitlist';
import type {
  WaitlistQueryParams,
  WaitlistStatus,
} from '@/types/waitlist-admin';

interface WaitlistFiltersProps {
  filters: WaitlistQueryParams;
  onFiltersChange: (filters: WaitlistQueryParams) => void;
}

export function WaitlistFilters({
  filters,
  onFiltersChange,
}: WaitlistFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Debounce search
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: value || undefined, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = filters.status || filters.userType || filters.search;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by name, email, or organization..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 border-gray-300 rounded-xl h-11 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === 'all' ? undefined : (value as WaitlistStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-full lg:w-44 border-gray-300 rounded-xl h-11 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
          </SelectContent>
        </Select>

        {/* User Type Filter */}
        <Select
          value={filters.userType || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              userType: value === 'all' ? undefined : (value as UserType),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-full lg:w-52 border-gray-300 rounded-xl h-11 text-sm">
            <SelectValue placeholder="All User Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All User Types</SelectItem>
            {Object.values(UserType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={filters.sortBy || 'createdAt'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              sortBy: value as 'createdAt' | 'priority' | 'email',
            })
          }
        >
          <SelectTrigger className="w-full lg:w-40 border-gray-300 rounded-xl h-11 text-sm">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select
          value={filters.sortOrder || 'desc'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              sortOrder: value as 'asc' | 'desc',
            })
          }
        >
          <SelectTrigger className="w-full lg:w-32 border-gray-300 rounded-xl h-11 text-sm">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="border-gray-300 rounded-xl h-11 px-4 text-sm hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
