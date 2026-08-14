import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import { useRealtimeContent } from '@/hooks/useRealtimeContent';

export default function Gallery({ items = [] }) {
    useRealtimeContent('media');

    return (
        <PublicLayout>
            <Head title="Galerie photos & vidéos" />
            <Container className="py-14 sm:py-20">
                <SectionTitle
                    eyebrow="En images & vidéos"
                    title="Galerie photos & vidéos"
                    subtitle="Découvrez notre ferme, nos installations et nos volailles."
                />

                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((m) => (
                        <div
                            key={m.id}
                            className="group overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm transition hover:shadow-md"
                        >
                            <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-soil-800 relative">
                                {m.type === 'video' ? (
                                    <video src={m.url} controls className="h-full w-full object-cover" />
                                ) : (
                                    <img
                                        src={m.url}
                                        alt={m.alt_text || m.title || 'Média ferme'}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                )}
                            </div>
                            {m.title && (
                                <p className="p-3 text-xs text-gray-600 dark:text-sand-300 font-medium truncate">
                                    {m.title}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="mt-10 rounded-2xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-12 text-center text-sm text-gray-500 dark:text-sand-400">
                        Aucun média n'a été ajouté à la galerie pour le moment.
                    </div>
                )}
            </Container>
        </PublicLayout>
    );
}
