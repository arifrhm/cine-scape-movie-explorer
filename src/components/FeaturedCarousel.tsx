
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FeaturedMovieType, MovieDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FeaturedCarouselProps {
  movies: FeaturedMovieType[];
}

// Backgrounds for featured movies (in a real app, these would come from API)
const featuredBackdrops = [
  "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070",
  "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2069",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070",
];

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
  
  // Auto-advance the carousel
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 8000); // Change slide every 8 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);
  
  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);
  
  // Navigate to previous/next slide
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % movies.length
    );
  };
  
  // Navigate to movie details
  const handleViewDetails = (id: string) => {
    navigate(`/movie/${id}`);
  };
  
  if (movies.length === 0) return null;
  
  // Get the current movie, which could be either Movie or MovieDetail
  const currentMovie = movies[currentIndex];
  
  // Check if it has the full details of a MovieDetail
  const hasFullDetails = 'Genre' in currentMovie && 'Plot' in currentMovie;
  
  // If it doesn't have full details, provide fallback values
  const genre = hasFullDetails ? (currentMovie as MovieDetail).Genre : '';
  const plot = hasFullDetails ? (currentMovie as MovieDetail).Plot : '';
  const rated = hasFullDetails ? (currentMovie as MovieDetail).Rated : '';
  const runtime = hasFullDetails ? (currentMovie as MovieDetail).Runtime : '';
  
  return (
    <div 
      className="relative h-[85vh] w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-black">
            <img
              src={featuredBackdrops[currentIndex % featuredBackdrops.length]}
              alt={currentMovie.Title}
              className="w-full h-full object-cover opacity-60"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 h-full flex items-end pb-24">
            <div className="max-w-3xl">
              {/* Movie Tag */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="chip bg-white/10 text-white/90 backdrop-blur-sm mb-4">
                  {currentMovie.Type === "movie" ? "Featured Film" : "Featured Series"}
                </span>
              </motion.div>
              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4"
              >
                {currentMovie.Title}
              </motion.h1>
              
              {/* Year and Rating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center space-x-4 mb-4 text-white/80"
              >
                <span>{currentMovie.Year}</span>
                {hasFullDetails && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span>{rated}</span>
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span>{runtime}</span>
                  </>
                )}
              </motion.div>
              
              {/* Genre */}
              {hasFullDetails && genre && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {genre.split(", ").map((genreItem) => (
                    <span 
                      key={genreItem} 
                      className="chip bg-white/10 text-white/90 backdrop-blur-sm"
                    >
                      {genreItem}
                    </span>
                  ))}
                </motion.div>
              )}
              
              {/* Plot */}
              {hasFullDetails && plot && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-white/90 text-lg mb-8 line-clamp-3"
                >
                  {plot}
                </motion.p>
              )}
              
              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Button 
                  onClick={() => handleViewDetails(currentMovie.imdbID)}
                  className="bg-white hover:bg-white/90 text-black"
                >
                  <Info className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-white w-8" 
                : "bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 btn-icon text-white/80 hover:text-white backdrop-blur-sm bg-black/20 hover:bg-black/40 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 btn-icon text-white/80 hover:text-white backdrop-blur-sm bg-black/20 hover:bg-black/40 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FeaturedCarousel;
