/**
 * Represents movie data from an external API like TMDB.
 * Stored in a 'movies' table to cache data and avoid re-fetching.
 */
export interface Movie {
    tmdb_id: number; // The Movie Database ID is the primary key
    title: string;
    release_date: string;
    director?: string;
    poster_url: string;
    backdrop_url?: string;
}

/**
 * Join table to track user interest in movies for the "Explore" feature.
 * Stored in the 'movie_interests' table.
 */
export interface MovieInterest {
    user_id: string; // Foreign key to profiles.id
    movie_tmdb_id: number; // Foreign key to movies.tmdb_id
    status: 'interested' | 'watched';
    created_at: string;
}


/**
 * Represents the structure of a single blog post,
 * mirroring the 'posts' table in your Supabase database.
 */
export interface BlogPost {
    id: string; // Or number, depending on your DB primary key
    createdAt: string; // ISO 8601 timestamp string
    title: string;
    slug: string; // URL-friendly version of the title (e.g., "my-first-post")
    content: string; // Can be string (Markdown) or JSON (for a rich text editor)
    bannerUrl: string;

    // Movie-specific details fetched from TMDB API
    movieApiId?: number;
    movieTitle?: string;
    moviePosterUrl?: string;
    movieReleaseDate?: string;
}

/**
 * Represents a comment on a blog post.
 * Designed for guests, so it only requires a name.
 */
export interface Comment {
    id: string; // Or number
    createdAt: string;
    postId: string; // Foreign key linking to the BlogPost
    authorName: string; // The name the commenter provides
    content: string;
}