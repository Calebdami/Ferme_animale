import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import ActivityCard from '@/Components/ActivityCard';

export default function Activities({ page, activities }) {
    return (
        <PublicLayout>
            <Head title={page?.title || 'Nos activités'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Ce que nous faisons" title={page?.title || 'Nos activités'} subtitle={page?.subtitle} />
                {page?.content && <p className="mt-6 max-w-2xl whitespace-pre-line text-gray-500 dark:text-sand-400">{page.content}</p>}
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {activities.map((a) => <ActivityCard key={a.id} activity={a} />)}
                </div>
            </Container>
        </PublicLayout>
    );
}
