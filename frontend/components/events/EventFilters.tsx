'use client';

import { useState } from 'react';
import { Event } from '@/lib/eventsData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';

interface EventFiltersProps {
  events: Event[];
  filteredEvents: Event[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  type: string;
  category: string;
  status: string;
  featured: boolean | null;
}

export function EventFilters({ events, filteredEvents, onFilterChange }: EventFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    category: '',
    status: '',
    featured: null
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      type: '',
      category: '',
      status: '',
      featured: null
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== false
  );

  const eventTypes = [...new Set(events.map(event => event.type))];
  const eventCategories = [...new Set(events.map(event => event.category))];
  const eventStatuses = [...new Set(events.map(event => event.status))];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        <Select value={filters.type || 'all'} onValueChange={(value) => updateFilter('type', value === 'all' ? '' : value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value === 'all' ? '' : value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {eventCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {eventStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={filters.featured === true ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter('featured', filters.featured === true ? null : true)}
          >
            Featured
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Count and Active Filters */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </p>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: {filters.search}
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="text-xs">
                  Type: {filters.type}
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="text-xs">
                  Category: {filters.category}
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="text-xs">
                  Status: {filters.status}
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
