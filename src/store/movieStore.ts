
import { create } from "zustand";
import { Movie, SearchResponse, MovieFilters, MovieDetail } from "@/lib/types";

interface MovieState {
  searchQuery: string;
  searchResults: Movie[];
  totalResults: number;
  isSearching: boolean;
  currentPage: number;
  selectedMovie: MovieDetail | null;
  filters: MovieFilters;
  error: string | null;
  
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResponse) => void;
  setIsSearching: (isSearching: boolean) => void;
  setCurrentPage: (page: number) => void;
  setSelectedMovie: (movie: MovieDetail | null) => void;
  updateFilters: (filters: Partial<MovieFilters>) => void;
  resetFilters: () => void;
  setError: (error: string | null) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  searchQuery: "",
  searchResults: [],
  totalResults: 0,
  isSearching: false,
  currentPage: 1,
  selectedMovie: null,
  filters: {
    type: "",
    yearStart: 1900,
    yearEnd: new Date().getFullYear(),
  },
  error: null,
  
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  setSearchResults: (results: SearchResponse) => 
    set({ 
      searchResults: results.Search || [], 
      totalResults: parseInt(results.totalResults || "0", 10),
      error: results.Error || null,
    }),
  
  setIsSearching: (isSearching: boolean) => set({ isSearching }),
  
  setCurrentPage: (page: number) => set({ currentPage: page }),
  
  setSelectedMovie: (movie: MovieDetail | null) => set({ selectedMovie: movie }),
  
  updateFilters: (filters: Partial<MovieFilters>) => 
    set((state) => ({ 
      filters: { ...state.filters, ...filters },
      currentPage: 1, // Reset to first page when filters change
    })),
  
  resetFilters: () => 
    set({ 
      filters: {
        type: "",
        yearStart: 1900,
        yearEnd: new Date().getFullYear(),
      },
      currentPage: 1,
    }),
  
  setError: (error: string | null) => set({ error }),
}));
