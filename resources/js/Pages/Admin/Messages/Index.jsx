import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ messages }) {
    const markRead = (m) => {
        if (!m.is_read) router.put(route('admin.messages.update', m.id), {}, { preserveScroll: true });
    };

    const destroy = (m) => {
        if (confirm('Supprimer ce message ?')) router.delete(route('admin.messages.destroy', m.id));
    };

    return (
        <AdminLayout title="Messages reçus">
            <Head title="Messages" />
            <div className="space-y-3">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        onClick={() => markRead(m)}
                        className={`cursor-pointer rounded-xl border p-4 ${m.is_read ? 'border-soil-700 bg-soil-900/60' : 'border-yolk-600/50 bg-yolk-500/5'}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-sand-100">{m.name} <span className="font-normal text-sand-500">— {m.email}</span></p>
                                {m.phone && <p className="text-xs text-sand-500">{m.phone}</p>}
                                {m.subject && <p className="mt-1 text-sm text-sand-300">Sujet : {m.subject}</p>}
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); destroy(m); }} className="shrink-0 text-xs text-clay-500 hover:underline">
                                Supprimer
                            </button>
                        </div>
                        <p className="mt-3 whitespace-pre-line text-sm text-sand-300">{m.message}</p>
                        <p className="mt-3 text-xs text-sand-500">{new Date(m.created_at).toLocaleString('fr-FR')}</p>
                    </div>
                ))}
                {messages.length === 0 && <p className="text-sm text-sand-500">Aucun message reçu pour le moment.</p>}
            </div>
        </AdminLayout>
    );
}
