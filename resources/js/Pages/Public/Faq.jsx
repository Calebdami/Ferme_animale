import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import { useRealtimeContent } from '@/hooks/useRealtimeContent';

export default function Faq({ page, faqs = [] }) {
    useRealtimeContent(['faq', 'pages']);
    const [openId, setOpenId] = useState(faqs[0]?.id || null);

    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <PublicLayout>
            <Head title={page?.title || 'FAQ — Questions fréquentes'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle
                    eyebrow="Besoin d'aide"
                    title={page?.title || 'Questions fréquentes'}
                    subtitle={page?.subtitle || 'Retrouvez les réponses aux questions les plus courantes sur notre ferme.'}
                />

                {page?.content && (
                    <div
                        className="mt-6 max-w-3xl text-gray-600 dark:text-sand-300 prose dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                )}

                <div className="mt-10 max-w-3xl space-y-4">
                    {faqs.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-8 text-center text-sm text-gray-500 dark:text-sand-400">
                            Aucune question n'a été ajoutée pour le moment.
                        </div>
                    ) : (
                        faqs.map((item) => {
                            const isOpen = openId === item.id;
                            const focalX = item.focal_x ?? 50;
                            const focalY = item.focal_y ?? 50;
                            const zoom = item.zoom ?? 1;

                            return (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm transition"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggle(item.id)}
                                        className="flex w-full items-center justify-between p-5 text-left font-display text-base font-semibold text-gray-900 dark:text-sand-100 hover:text-yolk-500 dark:hover:text-yolk-400 transition-colors"
                                    >
                                        <span className="pr-4">{item.question}</span>
                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yolk-500/10 text-yolk-500 font-bold transition-transform duration-200 ${isOpen ? 'rotate-180 bg-yolk-500 text-soil-950' : ''}`}>
                                            ↓
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-gray-100 dark:border-soil-800 p-5 pt-4 text-sm text-gray-600 dark:text-sand-300 space-y-4">
                                            {/* Image optionnelle avec focal point */}
                                            {item.image_url && (
                                                <div className="aspect-video max-w-md overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800">
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.question}
                                                        className="h-full w-full object-cover"
                                                        style={{
                                                            objectPosition: `${focalX}% ${focalY}%`,
                                                            transform: `scale(${zoom})`,
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div
                                                className="prose dark:prose-invert max-w-none text-gray-600 dark:text-sand-300"
                                                dangerouslySetInnerHTML={{ __html: item.answer }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </Container>
        </PublicLayout>
    );
}
