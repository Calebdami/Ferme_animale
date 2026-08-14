import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import { useRealtimeContent } from '@/hooks/useRealtimeContent';

export default function Facilities({ page, photos = [] }) {
    useRealtimeContent(['pages', 'media']);

    return (
        <PublicLayout>
            <Head title={page?.title || 'Nos installations & locaux'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Nos infrastructures" title={page?.title || 'Nos installations'} subtitle={page?.subtitle} />

                {page?.content && (
                    <div
                        className="mt-6 max-w-3xl text-gray-600 dark:text-sand-300 prose dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                )}

                {photos.length > 0 && (
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {photos.map((m) => (
                            <div key={m.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none">
                                {m.type === 'video' ? (
                                    <video src={m.url} controls className="aspect-video w-full object-cover" />
                                ) : (
                                    <img src={m.url} alt={m.alt_text || m.title || 'Installation'} className="aspect-video w-full object-cover" />
                                )}
                                {m.title && <p className="p-3 text-sm font-medium text-gray-600 dark:text-sand-300">{m.title}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </PublicLayout>
    );
}
