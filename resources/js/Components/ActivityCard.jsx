import Icon from './Icon';

export default function ActivityCard({ activity }) {
    return (
        <div className="group rounded-xl border border-soil-700 bg-soil-900/60 p-5 transition hover:border-yolk-600/60">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-yolk-500/10 text-yolk-400">
                <Icon name={activity.icon} className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold text-sand-100">{activity.title}</h3>
            {activity.description && (
                <p className="mt-2 text-sm leading-relaxed text-sand-500">{activity.description}</p>
            )}
        </div>
    );
}
