// lib/actions.ts
'use server';

import { z } from 'zod';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ofetch } from "ofetch";

// Defines the shape of the state object for the createPost form action.
export type CreatePostState = {
    errors?: {
        title?: string[];
        banner?: string[];
        content?: string[];
    };
    message?: string | null;
};

// Zod schema for validating the blog post form data.
const PostSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
    content: z.string().min(50, { message: 'Content must be at least 50 characters long.' }),
    banner: z
        .instanceof(File)
        .refine((file) => file.size < 4 * 1024 * 1024, 'Max image size is 4MB.')
        .optional(),
    movieApiId: z.string().optional(),
    movieTitle: z.string().optional(),
    moviePosterUrl: z.string().optional(),
    movieReleaseDate: z.string().optional(),
});

/**
 * Server action to create a new blog post.
 * Handles form validation, file upload, and data insertion.
 */
export async function createPost(prevState: CreatePostState, formData: FormData): Promise<CreatePostState> {
    const validatedFields = PostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        banner: (formData.get('banner') as File)?.size > 0 ? formData.get('banner') : undefined,
        movieApiId: formData.get('movieApiId'),
        movieTitle: formData.get('movieTitle'),
        moviePosterUrl: formData.get('moviePosterUrl'),
        movieReleaseDate: formData.get('movieReleaseDate'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to create post.',
        };
    }

    const { title, content, banner, ...movieDetails } = validatedFields.data;
    let bannerUrl = '';

    if (banner && banner.size > 0) {
        try {
            const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
            const buffer = Buffer.from(await banner.arrayBuffer());
            const filename = `${Date.now()}-${banner.name.replace(/\s/g, '_')}`;
            const file = bucket.file(`blog-banners/${filename}`);

            await file.save(buffer, {
                metadata: { contentType: banner.type },
            });

            bannerUrl = file.publicUrl();

        } catch (error) {
            console.error('Storage Error:', error);
            return { message: 'Database Error: Failed to upload banner image.' };
        }
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
        const postsCollection = adminDb.collection('posts');
        await postsCollection.add({
            title,
            slug,
            content,
            bannerUrl,
            createdAt: new Date().toISOString(),
            ...(movieDetails.movieApiId && { movieApiId: parseInt(movieDetails.movieApiId, 10) }),
            ...(movieDetails.movieTitle && { movieTitle: movieDetails.movieTitle }),
            ...(movieDetails.moviePosterUrl && { moviePosterUrl: movieDetails.moviePosterUrl }),
            ...(movieDetails.movieReleaseDate && { movieReleaseDate: movieDetails.movieReleaseDate }),
        });

    } catch (error) {
        console.error('Firestore Error:', error);
        return { message: 'Database Error: Failed to create post.' };
    }

    revalidatePath('/blog');
    redirect(`/blog/${slug}`);
}


// --- THE FIX: Define a type for the TMDB API response ---
interface CrewMember {
    job: string;
    name: string;
}

/**
 * Server action to fetch detailed information for a specific movie from the TMDB API.
 * This includes overview, cast, director, and genres.
 */
export async function getMovieDetails(movieId: number) {
    'use server';

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!TMDB_API_KEY) {
        throw new Error('TMDB API Key is not configured.');
    }

    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
        const details = await ofetch(url);

        // Use the specific CrewMember type instead of 'any'
        const director = details.credits?.crew.find((person: CrewMember) => person.job === 'Director');

        return {
            overview: details.overview,
            cast: details.credits?.cast.slice(0, 6) || [],
            director: director?.name || 'N/A',
            genres: details.genres || [],
        };
    } catch (error) {
        console.error('Failed to fetch movie details from TMDB:', error);
        throw new Error('Could not retrieve movie details.');
    }
}