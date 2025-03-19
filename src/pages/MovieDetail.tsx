
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { movieApi } from "@/lib/api";
import { useMovieStore } from "@/store/movieStore";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Clock, Award, Calendar, Film, Info } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import { toast } from "sonner";
import { motion } from "framer-motion";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedMovie, selectedMovie } = useMovieStore();
  
  // Fetch movie details
  const { data: movie, isPending, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => movieApi.getMovieById(id!),
    enabled: !!id
  });
  
  // Handle success and error separately with useEffect
  useEffect(() => {
    if (movie) {
      if (movie.Response === "True") {
        setSelectedMovie(movie);
      } else {
        toast.error("Movie not found");
        navigate("/");
      }
    }
  }, [movie, navigate, setSelectedMovie]);
  
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load movie details");
      navigate("/");
    }
  }, [isError, navigate]);
  
  // Prepare data for ratings chart
  const prepareRatingsData = () => {
    if (!movie || !movie.Ratings || movie.Ratings.length === 0) {
      return [];
    }
    
    return movie.Ratings.map(rating => {
      let value = 0;
      
      // Convert ratings to a number out of 10
      if (rating.Source === "Internet Movie Database") {
        // Format: "8.5/10"
        value = parseFloat(rating.Value.split("/")[0]) || 0;
      } else if (rating.Source === "Rotten Tomatoes") {
        // Format: "92%"
        value = (parseInt(rating.Value.replace("%", ""), 10) / 10) || 0;
      } else if (rating.Source === "Metacritic") {
        // Format: "90/100"
        value = (parseInt(rating.Value.split("/")[0], 10) / 10) || 0;
      }
      
      return {
        name: rating.Source,
        value: parseFloat(value.toFixed(1)),
        fullScore: rating.Value,
      };
    });
  };
  
  // Prepare data for genre pie chart
  const prepareGenreData = () => {
    if (!movie || !movie.Genre) {
      return [];
    }
    
    return movie.Genre.split(", ").map(genre => ({
      name: genre,
      value: 1,
    }));
  };
  
  // Chart colors
  const CHART_COLORS = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"];
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <AnimatedPage>
      <main className="min-h-screen pt-16">
        {/* Loading State */}
        {isPending && (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading movie details...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {isError && (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load movie details</p>
              <Button onClick={handleBack}>Go Back</Button>
            </div>
          </div>
        )}
        
        {/* Movie Details */}
        {movie && movie.Response === "True" && (
          <>
            {/* Hero Section */}
            <section className="relative">
              {/* Background Image */}
              <div className="absolute inset-0 bg-black">
                <div 
                  className="w-full h-[50vh] md:h-[60vh] bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage: `url(${movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg"})`,
                    backgroundPosition: "center 20%",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="container mx-auto px-4 relative z-10 pt-20 pb-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Back Button (Mobile) */}
                  <div className="md:hidden mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleBack}
                      className="hover:bg-white/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </div>
                  
                  {/* Poster */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full md:w-80 shrink-0"
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-xl">
                      <img
                        src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg"}
                        alt={movie.Title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Details */}
                  <div className="flex-1 pt-4 md:pt-16">
                    {/* Back Button (Desktop) */}
                    <div className="hidden md:block mb-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBack}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      {/* Movie Type Chip */}
                      <span className="chip bg-primary/10 text-primary mb-4">
                        {movie.Type === "movie" ? "Film" : movie.Type}
                      </span>
                      
                      {/* Title */}
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.Title}</h1>
                      
                      {/* Year and Runtime */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span>{movie.Year}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>{movie.Runtime}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Film className="h-4 w-4 mr-1.5" />
                          <span>{movie.Rated}</span>
                        </div>
                        
                        {movie.imdbRating !== "N/A" && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1.5 text-yellow-500" />
                            <span>{movie.imdbRating}/10</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Genres */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {movie.Genre.split(", ").map(genre => (
                          <span key={genre} className="chip bg-secondary text-secondary-foreground">
                            {genre}
                          </span>
                        ))}
                      </div>
                      
                      {/* Plot */}
                      <p className="text-lg mb-6">{movie.Plot}</p>
                      
                      {/* Cast & Crew */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        {movie.Director !== "N/A" && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Director</h3>
                            <p>{movie.Director}</p>
                          </div>
                        )}
                        
                        {movie.Writer !== "N/A" && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Writer</h3>
                            <p>{movie.Writer}</p>
                          </div>
                        )}
                        
                        {movie.Actors !== "N/A" && (
                          <div className="sm:col-span-2">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Cast</h3>
                            <p>{movie.Actors}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Additional Details */}
                      {(movie.Awards !== "N/A" || movie.BoxOffice !== "N/A" || movie.Production !== "N/A") && (
                        <div className="space-y-3 mb-8">
                          <Separator />
                          
                          {movie.Awards !== "N/A" && (
                            <div className="flex items-start pt-3">
                              <Award className="h-5 w-5 mr-3 mt-0.5 text-yellow-500" />
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Awards</h3>
                                <p>{movie.Awards}</p>
                              </div>
                            </div>
                          )}
                          
                          {movie.BoxOffice !== "N/A" && (
                            <div className="flex items-start pt-2">
                              <div className="h-5 w-5 mr-3 mt-0.5 flex items-center justify-center text-green-500 font-bold">$</div>
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Box Office</h3>
                                <p>{movie.BoxOffice}</p>
                              </div>
                            </div>
                          )}
                          
                          {movie.Production !== "N/A" && (
                            <div className="flex items-start pt-2">
                              <Info className="h-5 w-5 mr-3 mt-0.5 text-blue-500" />
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Production</h3>
                                <p>{movie.Production}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Data Visualization Section */}
            <section className="container mx-auto px-4 py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-8">Insights</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Ratings Chart */}
                  {movie.Ratings && movie.Ratings.length > 0 && (
                    <div className="bg-card p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-medium mb-6">Ratings Comparison</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={prepareRatingsData()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                          >
                            <XAxis 
                              dataKey="name" 
                              angle={-25} 
                              textAnchor="end" 
                              height={60} 
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis domain={[0, 10]} />
                            <RechartsTooltip
                              formatter={(value, name, props) => [
                                props.payload.fullScore,
                                props.payload.name,
                              ]}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                              {prepareRatingsData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  {/* Genre Distribution */}
                  {movie.Genre && (
                    <div className="bg-card p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-medium mb-6">Genre Distribution</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={prepareGenreData()}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name }) => name}
                            >
                              {prepareGenreData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip formatter={(value, name) => [name, ""]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </section>
          </>
        )}
      </main>
    </AnimatedPage>
  );
};

export default MovieDetail;
