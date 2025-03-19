
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Film, X, Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useMovieStore } from "@/store/movieStore";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useMovieStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Update local search query when the global search query changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
    
    // If we're not already on the home page, navigate there
    if (location.pathname !== "/") {
      navigate("/");
    }
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3",
        isScrolled ? 
          "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm" : 
          "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Film 
              className={cn(
                "h-8 w-8 transition-all duration-500",
                isScrolled ? "text-primary" : "text-white"
              )} 
            />
            <span 
              className={cn(
                "text-xl font-bold tracking-tight transition-all duration-500",
                isScrolled ? "text-primary" : "text-white"
              )}
            >
              CineScape
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search movies..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-[300px] pl-10 bg-white/10 border-white/20 text-primary dark:text-white placeholder:text-gray-500 focus:bg-white/90 dark:focus:bg-black/90 transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </form>

            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className={cn(
                  "text-sm transition-colors duration-300",
                  isScrolled ? "text-muted-foreground" : "text-white/70"
                )}>
                  Hi, {user?.name.split(' ')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className={cn(
                    "transition-colors duration-300",
                    isScrolled ? "" : "text-white hover:text-white hover:bg-white/20"
                  )}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  asChild
                  className={cn(
                    "transition-colors duration-300",
                    isScrolled ? "" : "text-white hover:text-white hover:bg-white/20"
                  )}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-white/90 hover:bg-white text-black hover:text-black"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className={cn(
                "h-6 w-6 transition-colors duration-300",
                isScrolled ? "text-primary" : "text-white"
              )} />
            ) : (
              <Menu className={cn(
                "h-6 w-6 transition-colors duration-300",
                isScrolled ? "text-primary" : "text-white"
              )} />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white dark:bg-black z-40 flex flex-col p-4 pt-24 md:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search movies..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </form>

        {/* Mobile Auth Links */}
        <div className="flex flex-col space-y-4">
          {isAuthenticated ? (
            <>
              <p className="text-muted-foreground px-2">
                Signed in as <span className="font-medium text-foreground">{user?.name}</span>
              </p>
              <Button 
                variant="ghost" 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="justify-start"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                asChild 
                className="justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/login">
                  <User className="mr-2 h-5 w-5" />
                  Login
                </Link>
              </Button>
              <Button 
                asChild
                className="justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
