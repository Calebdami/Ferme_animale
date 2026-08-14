import { Link } from '@inertiajs/react';
import Icon from './Icon';

export default function ActivityCard({ activity }) {
    const focalX = activity.focal_x ?? 50;
    const focalY = activity.focal_y ?? 50;
    const zoom = activity.zoom ?? 1;

    return (
        <Link
            href={activity.slug ? route('activities.show', activity.slug) : route('activities')}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 transition hover:border-yolk-500/60 dark:hover:border-yolk-600/60 shadow-sm dark:shadow-none"
        >
            {activity.cover_image_url && (
                <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-soil-800">
                    <img
                        src={activity.cover_image_url}
                        alt={activity.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        style={{
                            objectPosition: `${focalX}% ${focalY}%`,
                            transform: `scale(${zoom})`,
                        }}
                    />
                </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yolk-500/10 text-yolk-500">
                        <Icon name={activity.icon || 'feather'} className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100 group-hover:text-yolk-500 transition-colors">
                        {activity.title}
                    </h3>
                    {activity.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-sand-500 line-clamp-3">
                            {activity.description}
                        </p>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-yolk-500 group-hover:underline pt-2">
                    <span>En savoir plus</span>
                    <span>→</span>
                </div>
            </div>
        </Link>
    );
}
