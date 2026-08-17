import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import ActivityCard from '@/Components/ActivityCard';
import { useRealtimeContent } from '@/hooks/useRealtimeContent';

export default function Activities({ page, activities }) {
    useRealtimeContent(['activities', 'pages']);

    return (
        <PublicLayout>
            <Head title={page?.title || 'Nos activités'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Ce que nous faisons" title={page?.title || 'Nos activités'} subtitle={page?.subtitle} />
                {page?.content && (
                    <div
                        className="prose-content mt-6 max-w-3xl text-gray-600 dark:text-sand-300"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                )}
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {activities.map((a) => <ActivityCard key={a.id} activity={a} />)}
                </div>
            </Container>
        </PublicLayout>
    );
}
