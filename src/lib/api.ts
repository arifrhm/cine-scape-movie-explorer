import { toast } from "sonner";
import { 
  Movie, 
  MovieDetail, 
  SearchResponse, 
  MovieFilters 
} from "./types";

// API key for OMDb
const API_KEY = import.meta.env.VITE_OMDB_API_KEY; // Free OMDb API key for demo purposes
const BASE_URL = "https://www.omdbapi.com/";

// HTTP client with interceptors
const client = async (endpoint: string): Promise<any> => {
  try {
    // Get the auth token from local storage
    const token = localStorage.getItem("authToken");
    
    const headers: Record<string, string> = {};
    
    // Add auth token to headers if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: Object.keys(headers).length ? headers : undefined,
    });
    
    // Handle response
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.Error || "Network response was not ok");
    }
    
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(message);
    throw error;
  }
};

// API methods
export const movieApi = {
  // Search movies
  searchMovies: async (
    query: string, 
    page = 1, 
    filters?: MovieFilters
  ): Promise<SearchResponse> => {
    let endpoint = `?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
    
    // Apply filters if provided
    if (filters) {
      if (filters.type) {
        endpoint += `&type=${filters.type}`;
      }
      if (filters.yearStart && filters.yearEnd) {
        // OMDb only supports filtering by a specific year, not a range
        // For simplicity, we'll use the start year (filtering by range would require multiple requests)
        endpoint += `&y=${filters.yearStart}`;
      }
    }
    
    return client(endpoint);
  },
  
  // Get movie by ID
  getMovieById: async (id: string): Promise<MovieDetail> => {
    const endpoint = `?apikey=${API_KEY}&i=${id}&plot=full`;
    return client(endpoint);
  },
  
  // Get featured movies (normally this would come from a backend but we'll simulate it)
  getFeaturedMovies: async (): Promise<Movie[]> => {
    // Popular movie IDs (hardcoded for demo)
    const featuredIds = ["tt0111161", "tt0068646", "tt0468569", "tt0050083", "tt0108052"];
    
    // Fetch each movie by ID
    const promises = featuredIds.map(id => movieApi.getMovieById(id));
    return Promise.all(promises);
  }
};

// Mock authentication service
export const authApi = {
  login: async (email: string, password: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock credentials check
    if (email === "user@example.com" && password === "password") {
      const token = "mock-jwt-token-" + Math.random().toString(36).substring(2);
      localStorage.setItem("authToken", token);
      return token;
    }
    
    throw new Error("Invalid email or password");
  },
  
  register: async (
    name: string, 
    email: string, 
    password: string, 
    phone: string
  ): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration (always succeeds in this demo)
    const token = "mock-jwt-token-" + Math.random().toString(36).substring(2);
    localStorage.setItem("authToken", token);
    return token;
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem("authToken");
  },
  
  checkAuth: (): boolean => {
    return !!localStorage.getItem("authToken");
  }
};
