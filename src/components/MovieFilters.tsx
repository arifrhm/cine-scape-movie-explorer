
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMovieStore } from "@/store/movieStore";
import { MovieType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface MovieFiltersProps {
  className?: string;
}

const currentYear = new Date().getFullYear();
const minYear = 1900;

const MovieFilters: React.FC<MovieFiltersProps> = ({ className }) => {
  const { filters, updateFilters, resetFilters } = useMovieStore();
  
  // Handler for type selection
  const handleTypeChange = (value: string) => {
    updateFilters({ type: value as MovieType });
  };
  
  // Handler for year range slider
  const handleYearRangeChange = (value: number[]) => {
    updateFilters({
      yearStart: value[0],
      yearEnd: value[1],
    });
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={resetFilters}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Reset
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Refine your search results with these filters
        </p>
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <Label htmlFor="type-filter">Type</Label>
        <Select
          value={filters.type}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger id="type-filter" className="w-full">
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any type</SelectItem>
            <SelectItem value="movie">Movies</SelectItem>
            <SelectItem value="series">Series</SelectItem>
            <SelectItem value="episode">Episodes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Year Range Filter */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Year Range</Label>
          <div className="pt-2">
            <Slider
              defaultValue={[filters.yearStart, filters.yearEnd]}
              min={minYear}
              max={currentYear}
              step={1}
              value={[filters.yearStart, filters.yearEnd]}
              onValueChange={handleYearRangeChange}
              className="my-6"
            />
          </div>
        </div>
        
        {/* Year display */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{filters.yearStart}</span>
          <span>{filters.yearEnd}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;
