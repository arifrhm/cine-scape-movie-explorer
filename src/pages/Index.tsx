
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import { useMovieStore } from "@/store/movieStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import MasonryGrid from "@/components/MasonryGrid";
import MovieFilters from "@/components/MovieFilters";
import AnimatedPage from "@/components/AnimatedPage";
import { toast } from "sonner";

const Index = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setSearchResults, 
    searchResults, 
    currentPage, 
    setCurrentPage, 
    totalResults, 
    filters 
  } = useMovieStore();
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // Fetch featured movies
  const featuredMoviesQuery = useQuery({
    queryKey: ["featuredMovies"],
    queryFn: movieApi.getFeaturedMovies,
    staleTime: Infinity, // These don't change often
  });
  
  // Search movies query
  const searchMoviesQuery = useQuery({
    queryKey: ["searchMovies", searchQuery, currentPage, filters],
    queryFn: () => movieApi.searchMovies(searchQuery, currentPage, filters),
    enabled: !!searchQuery && shouldFetch,
    meta: {
      onSuccess: (data: any) => {
        if (data.Response === "True") {
          setSearchResults(data);
        } else {
          toast.error(data.Error || "No results found");
        }
        setShouldFetch(false);
      },
      onError: () => {
        setShouldFetch(false);
      }
    }
  });
  
  // Handle success and error manually since we can't use the deprecated syntax
  useEffect(() => {
    if (searchMoviesQuery.isSuccess) {
      const data = searchMoviesQuery.data;
      if (data.Response === "True") {
        setSearchResults(data);
      } else {
        toast.error(data.Error || "No results found");
      }
      setShouldFetch(false);
    }
    
    if (searchMoviesQuery.isError) {
      setShouldFetch(false);
    }
  }, [searchMoviesQuery.isSuccess, searchMoviesQuery.isError, searchMoviesQuery.data, setSearchResults]);
  
  // Function to handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!localSearchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    setSearchQuery(localSearchQuery);
    setCurrentPage(1);
    setShouldFetch(true);
  };
  
  // Function to clear search
  const handleClearSearch = () => {
    setLocalSearchQuery("");
    setSearchQuery("");
    setSearchResults({ Search: [], totalResults: "0", Response: "False" });
    setShouldFetch(false);
  };
  
  // Function to load more results
  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
    setShouldFetch(true);
  };
  
  // Update local state when global state changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  // Compute total pages
  const totalPages = Math.ceil(totalResults / 10);
  
  return (
    <AnimatedPage>
      {/* Featured Movies Carousel (show only when not searching) */}
      {!searchQuery && (
        <section className="pt-0">
          {featuredMoviesQuery.isPending ? (
            <div className="h-[60vh] flex items-center justify-center bg-muted/50">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : featuredMoviesQuery.isError ? (
            <div className="h-[60vh] flex items-center justify-center">
              <p className="text-lg text-red-500">Error loading featured movies</p>
            </div>
          ) : (
            <FeaturedCarousel movies={featuredMoviesQuery.data || []} />
          )}
        </section>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section (if not showing in featured section) */}
        {searchQuery && (
          <section className="my-8">
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search for movies, series, episodes..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="w-full pl-10"
                  disabled={searchMoviesQuery.isPending}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                
                {localSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setLocalSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <Button type="submit" disabled={searchMoviesQuery.isPending}>
                {searchMoviesQuery.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
              
              {searchQuery && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleClearSearch}
                  disabled={searchMoviesQuery.isPending}
                >
                  Clear
                </Button>
              )}
            </form>
          </section>
        )}
        
        {/* Search Results */}
        {searchQuery && (
          <section className="mt-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters (Desktop) */}
              <div className="hidden md:block w-64 shrink-0">
                <div className="sticky top-24">
                  <MovieFilters />
                </div>
              </div>
              
              {/* Results */}
              <div className="flex-1">
                {/* Mobile Filters Toggle */}
                <div className="md:hidden mb-6">
                  <MovieFilters />
                </div>
                
                {/* Results Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    {searchMoviesQuery.isPending 
                      ? "Searching..." 
                      : `Results for "${searchQuery}"`
                    }
                  </h2>
                  {!searchMoviesQuery.isPending && searchResults.length > 0 && (
                    <p className="text-muted-foreground">
                      Found {totalResults} results
                    </p>
                  )}
                </div>
                
                {/* Loading State */}
                {searchMoviesQuery.isPending && (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                
                {/* Error State */}
                {searchMoviesQuery.isError && (
                  <div className="text-center py-12">
                    <p className="text-red-500 mb-2">
                      Error searching for movies
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShouldFetch(true)}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
                
                {/* Empty State */}
                {!searchMoviesQuery.isPending && 
                  !searchMoviesQuery.isError && 
                  searchResults.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-2">
                      No movies found for your search
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleClearSearch}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
                
                {/* Results Grid */}
                {!searchMoviesQuery.isPending && 
                  !searchMoviesQuery.isError && 
                  searchResults.length > 0 && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {searchResults.map((movie, index) => (
                        <MovieCard 
                          key={movie.imdbID} 
                          movie={movie} 
                          index={index}
                        />
                      ))}
                    </div>
                    
                    {/* Load More Button */}
                    {currentPage < totalPages && (
                      <div className="flex justify-center mt-12">
                        <Button 
                          onClick={handleLoadMore}
                          disabled={searchMoviesQuery.isPending}
                          variant="outline"
                          className="min-w-[200px]"
                        >
                          {searchMoviesQuery.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            "Load More"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        )}
        
        {/* Discover Section (when not searching) */}
        {!searchQuery && (
          <section className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Discover Movies</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Search for your favorite movies, TV shows, and episodes using the search bar above
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto mt-8">
                <div className="relative flex-1">
                  <Input
                    type="search"
                    placeholder="Try 'Inception', 'Breaking Bad'..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
            
            {/* Top Rated Movies Grid (shows when featured movies are loaded) */}
            {featuredMoviesQuery.data && featuredMoviesQuery.data.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Top Rated</h3>
                <MasonryGrid movies={featuredMoviesQuery.data} />
              </div>
            )}
          </section>
        )}
      </main>
    </AnimatedPage>
  );
};

export default Index;
