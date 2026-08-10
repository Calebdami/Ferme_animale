import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats, recentMessages }) {
    const cards = [
        { label: 'Types de volailles', value: stats.poultryTypes, route: 'admin.poultry-types.index' },
        { label: 'Dont disponibles', value: stats.poultryAvailable, route: 'admin.poultry-types.index' },
        { label: 'Articles publiés', value: stats.newsArticles, route: 'admin.news.index' },
        { label: 'Messages non lus', value: stats.unreadMessages, route: 'admin.messages.index' },
    ];

    return (
        <AdminLayout title="Tableau de bord">
            <Head title="Tableau de bord" />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {cards.map((c) => (
                    <Link key={c.label} href={route(c.route)} className="rounded-xl border border-soil-700 bg-soil-900/60 p-5 transition hover:border-yolk-600/60">
                        <p className="font-display text-3xl font-semibold text-yolk-400">{c.value}</p>
                        <p className="mt-1 text-sm text-sand-500">{c.label}</p>
                    </Link>
                ))}
            </div>

            <div className="mt-10">
                <h2 className="mb-4 font-display text-lg font-semibold text-sand-100">Derniers messages reçus</h2>
                <div className="overflow-hidden rounded-xl border border-soil-700">
                    {recentMessages.length === 0 && (
                        <p className="p-5 text-sm text-sand-500">Aucun message pour le moment.</p>
                    )}
                    {recentMessages.map((m) => (
                        <div key={m.id} className="flex items-center justify-between border-b border-soil-800 p-4 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-sand-100">{m.name} <span className="text-sand-500">— {m.email}</span></p>
                                <p className="mt-1 line-clamp-1 text-sm text-sand-500">{m.message}</p>
                            </div>
                            {!m.is_read && <span className="ml-3 shrink-0 rounded-full bg-yolk-500/15 px-2 py-0.5 text-xs text-yolk-400">Nouveau</span>}
                        </div>
                    ))}
                </div>
                <Link href={route('admin.messages.index')} className="mt-3 inline-block text-sm text-yolk-400 hover:underline">
                    Voir tous les messages →
                </Link>
            </div>
        </AdminLayout>
    );
}
