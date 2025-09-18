// app/blog/page.tsx

import { fetchAllPosts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { BlogPost } from "@/lib/definitions"; // Import the BlogPost type

// Update the component to use the proper BlogPost type
function PostListItem({ post }: { post: BlogPost }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900"
        >
            {/* Image or Fallback Square */}
            <div className="flex-shrink-0 relative w-full sm:w-48 h-32 overflow-hidden rounded-lg">
                {post.bannerUrl ? (
                    <Image
                        src={post.bannerUrl}
                        alt={`Banner for ${post.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-600">
                        <PhotoIcon className="w-12 h-12" />
                    </div>
                )}
            </div>

            {/* Post Details */}
            <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-zinc-300 line-clamp-2">
                    {/* Handle content based on its type - string or JSON */}
                    {typeof post.content === 'string'
                        ? post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')
                        : 'No content preview available.'
                    }
                </p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400">
                    <p>
                        By <span className="font-medium text-gray-700 dark:text-zinc-200">Livya</span> on{' '}
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Read post &rarr;
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default async function BlogIndexPage() {
    const posts = await fetchAllPosts();

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="pb-8 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
                        The Blog
                    </h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-zinc-400">
                        Thoughts, stories, and movie reviews from Livya.
                    </p>
                </div>
                <Link
                    href="/blog/create"
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Create Post</span>
                </Link>
            </div>

            {/* Posts List */}
            <div className="mt-12 space-y-8">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <PostListItem key={post.id} post={post} />
                    ))
                ) : (
                    <div className="text-center py-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-800">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">No Posts Yet</h3>
                        <p className="mt-2 text-gray-500 dark:text-zinc-400">Looks like there&apos;s nothing here. Be the first to create a post!</p>
                    </div>
                )}
            </div>
        </main>
    );
}