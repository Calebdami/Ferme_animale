import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import Icon from '@/Components/Icon';
import { useRealtimeContent } from '@/hooks/useRealtimeContent';

export default function ActivityShow({ activity }) {
    useRealtimeContent('activities');

    const focalX = activity.focal_x ?? 50;
    const focalY = activity.focal_y ?? 50;
    const zoom = activity.zoom ?? 1;

    return (
        <PublicLayout>
            <Head title={activity.title} />

            <Container className="py-14 sm:py-20">
                <Link
                    href={route('activities')}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-sand-500 hover:text-yolk-500 transition-colors"
                >
                    <span>←</span>
                    <span>Toutes nos activités</span>
                </Link>

                <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yolk-500/10 text-yolk-500 shrink-0">
                        <Icon name={activity.icon || 'feather'} className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-display text-3xl font-semibold text-gray-900 dark:text-sand-100 sm:text-4xl">
                            {activity.title}
                        </h1>
                        {activity.description && (
                            <p className="mt-1 text-base text-gray-500 dark:text-sand-400">
                                {activity.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Photo de couverture */}
                {activity.cover_image_url && (
                    <div className="mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800 shadow-sm">
                        <img
                            src={activity.cover_image_url}
                            alt={activity.title}
                            className="h-full w-full object-cover"
                            style={{
                                objectPosition: `${focalX}% ${focalY}%`,
                                transform: `scale(${zoom})`,
                            }}
                        />
                    </div>
                )}

                {/* Déroulement / Description complète */}
                {activity.content && (
                    <div className="mt-10 rounded-2xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 sm:p-10 shadow-sm">
                        <h2 className="mb-4 font-display text-xl font-semibold text-gray-900 dark:text-sand-100">
                            Déroulement de l'activité
                        </h2>
                        <div
                            className="prose dark:prose-invert max-w-none text-gray-600 dark:text-sand-300"
                            dangerouslySetInnerHTML={{ __html: activity.content }}
                        />
                    </div>
                )}

                {/* Galerie média de l'activité (Photos et Vidéos) */}
                {activity.media_list && activity.media_list.length > 0 && (
                    <div className="mt-12 space-y-6">
                        <h2 className="font-display text-2xl font-semibold text-gray-900 dark:text-sand-100">
                            Photos & Vidéos de l'activité ({activity.media_list.length})
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {activity.media_list.map((item) => (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm"
                                >
                                    {item.type === 'video' ? (
                                        <video
                                            src={item.url}
                                            controls
                                            className="aspect-video w-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={item.url}
                                            alt={item.title || activity.title}
                                            className="aspect-video w-full object-cover"
                                        />
                                    )}
                                    {item.title && (
                                        <p className="p-3 text-xs text-gray-600 dark:text-sand-300 font-medium">
                                            {item.title}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Contact */}
                <div className="mt-14 rounded-2xl border border-yolk-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-soil-900 dark:to-soil-800 p-8 text-center sm:p-10">
                    <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-sand-100">
                        Intéressé par cette activité ?
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-sand-400">
                        Contactez l'équipe de la ferme pour plus d'informations ou planifier une prestation.
                    </p>
                    <Link
                        href={route('contact')}
                        className="mt-6 inline-block rounded-lg bg-yolk-500 px-6 py-3 text-sm font-medium text-soil-950 hover:bg-yolk-400"
                    >
                        Nous contacter
                    </Link>
                </div>
            </Container>
        </PublicLayout>
    );
}
