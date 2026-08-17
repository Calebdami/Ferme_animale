import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import Icon from '@/Components/Icon';
import { useRealtimeContent } from '@/hooks/useRealtimeContent';

const defaultPoints = [
    'Dépistage sanitaire systématique avant la vente',
    'Protocoles de vaccination adaptés à chaque race',
    'Zone de quarantaine dédiée aux nouveaux arrivages',
    'Traçabilité complète de chaque lot',
    'Partenariat avec un laboratoire vétérinaire',
];

export default function Quality({ page, media = [] }) {
    useRealtimeContent(['pages', 'media']);

    return (
        <PublicLayout>
            <Head title={page?.title || 'Qualité & biosécurité'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Notre engagement" title={page?.title || 'Qualité, sanitaire et biosécurité'} subtitle={page?.subtitle} />

                {page?.content && (
                    <div
                        className="mt-6 max-w-3xl text-gray-600 dark:text-sand-300 prose dark:prose-invert prose-content"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                )}

                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                    {defaultPoints.map((p) => (
                        <li key={p} className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                            <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-pasture-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-sand-300">{p}</span>
                        </li>
                    ))}
                </ul>

                {media.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-6 font-display text-xl font-semibold text-gray-900 dark:text-sand-100">
                            Médias & Certifications
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {media.map((m) => (
                                <div key={m.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm">
                                    {m.type === 'video' ? (
                                        <video src={m.url} controls className="aspect-video w-full object-cover" />
                                    ) : (
                                        <img src={m.url} alt={m.alt_text || m.title || 'Qualité'} className="aspect-video w-full object-cover" />
                                    )}
                                    {m.title && <p className="p-3 text-sm font-medium text-gray-600 dark:text-sand-300">{m.title}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </PublicLayout>
    );
}
