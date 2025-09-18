// app/lib/data.ts

import { adminDb } from '@/lib/firebase-admin';
import { BlogPost } from './definitions'; // Make sure BlogPost is exported from definitions


export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const postsRef = adminDb.collection('posts');
        const snapshot = await postsRef.where('slug', '==', slug).limit(1).get();

        if (snapshot.empty) {
            console.log('No matching post found for slug:', slug);
            return null;
        }

        const doc = snapshot.docs[0];
        const postData = doc.data();

        // Combine document data with its ID
        return {
            id: doc.id,
            ...postData,
        } as BlogPost;

    } catch (error) {
        console.error('Database Error fetching post by slug:', error);
        return null;
    }
}


export async function fetchAllPosts(): Promise<BlogPost[]> {
    try {
        const postsRef = adminDb.collection('posts');
        const snapshot = await postsRef.orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            return [];
        }

        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as BlogPost[];

        return posts;

    } catch (error) {
        console.error('Database Error fetching all posts:', error);
        return [];
    }
}