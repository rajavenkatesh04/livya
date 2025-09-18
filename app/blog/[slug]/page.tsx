// app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { fetchPostBySlug } from '@/lib/data';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Breadcrumbs from '@/app/ui/Breadcrumbs';
import MovieInfoCard from '@/app/ui/MovieInfoCard'; // Corrected path assuming it's in ui folder

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    // Await the params object before using its properties
    const { slug } = await params;
    const post = await fetchPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="w-full px-4 py-8">
            <article className="max-w-3xl mx-auto">

                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Blog', href: '/blog' },
                        { label: post.title, href: `/blog/${post.slug}`, active: true },
                    ]}
                />

                {/* --- UPDATED HEADER SECTION --- */}
                <header className="mt-6 mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-zinc-100 leading-tight">
                        {post.title}
                    </h1>
                    {/* Hardcoded author info */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-gray-500">
                            L
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-zinc-100">Livya</p>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">
                                Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                            </p>
                        </div>
                    </div>
                </header>

                {post.bannerUrl && (
                    <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={post.bannerUrl}
                            alt={`Banner image for ${post.title}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {post.movieApiId && (
                    <MovieInfoCard
                        movieApiId={post.movieApiId}
                        movieTitle={post.movieTitle}
                        moviePosterUrl={post.moviePosterUrl}
                        movieReleaseDate={post.movieReleaseDate}
                    />
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                <section className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Comments</h2>
                    <div className="mt-6 p-4 rounded-md bg-gray-100 dark:bg-zinc-800 text-center">
                        <p className="text-sm text-gray-600 dark:text-zinc-400">Comments feature coming soon!</p>
                    </div>
                </section>
            </article>
        </main>
    );
}