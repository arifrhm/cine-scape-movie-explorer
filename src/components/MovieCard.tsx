
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Eye } from "lucide-react";
import { Movie } from "@/lib/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  layout?: "grid" | "masonry";
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  index = 0,
  layout = "grid" 
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Default poster if none available
  const poster = movie.Poster === "N/A" 
    ? "/placeholder.svg" 
    : movie.Poster;
    
  // Handle click to navigate to movie details
  const handleClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05, // Stagger animation
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      whileHover={{ y: -5 }}
      className={cn(
        "movie-card group",
        layout === "masonry" ? "mb-6" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Poster Image */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={poster}
          alt={movie.Title}
          className={cn(
            "movie-card-poster transition-opacity",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        )}
        
        {/* Content overlay */}
        <div className="movie-card-content">
          {/* Title */}
          <h3 className="text-base font-medium line-clamp-1">{movie.Title}</h3>
          
          {/* Year and Type */}
          <div className="flex items-center text-xs text-white/70 mt-1">
            <span>{movie.Year}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{movie.Type}</span>
          </div>
        </div>
        
        {/* Hover overlay with action button */}
        <motion.div 
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <button 
            className="btn-glass text-white px-4 py-2 rounded-full flex items-center space-x-2"
            onClick={handleClick}
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
