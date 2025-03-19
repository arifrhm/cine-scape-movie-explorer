
import React from "react";
import { FeaturedMovieType } from "@/lib/types";
import MovieCard from "./MovieCard";

interface MasonryGridProps {
  movies: FeaturedMovieType[];
  columns?: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ 
  movies, 
  columns = 4 
}) => {
  // Create columns for masonry layout
  const createColumns = () => {
    const cols: FeaturedMovieType[][] = Array.from({ length: columns }, () => []);
    
    // Distribute movies across columns
    movies.forEach((movie, i) => {
      cols[i % columns].push(movie);
    });
    
    return cols;
  };
  
  const columnData = createColumns();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {columnData.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col space-y-6">
          {column.map((movie, movieIndex) => (
            <MovieCard 
              key={movie.imdbID} 
              movie={movie} 
              index={(colIndex * (movies.length / columns)) + movieIndex}
              layout="masonry"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
