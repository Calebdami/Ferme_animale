import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';

export default function NewsShow({ article }) {
    return (
        <PublicLayout>
            <Head title={article.title} />
            <Container className="py-14 sm:py-20">
                <Link href={route('news.index')} className="text-sm text-gray-500 dark:text-sand-500 hover:text-yolk-500">← Toutes les actualités</Link>
                <h1 className="mt-4 font-display text-3xl font-semibold text-gray-900 dark:text-sand-100">{article.title}</h1>
                {article.cover_image_url && (
                    <div className="mt-6 aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800">
                        <img src={article.cover_image_url} className="h-full w-full object-cover" />
                    </div>
                )}
                <div className="mt-8 max-w-2xl whitespace-pre-line text-gray-600 dark:text-sand-300">
                    {article.content}
                </div>
            </Container>
        </PublicLayout>
    );
}
