export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieDetail extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export type MovieType = 'movie' | 'series' | 'episode' | '';

export interface MovieFilters {
  type: MovieType;
  yearStart: number;
  yearEnd: number;
}

export type FeaturedMovieType = Movie | MovieDetail;
