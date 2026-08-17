import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import Icon from '@/Components/Icon';

export default function Index({ messages }) {
    const [deletingItem, setDeletingItem] = useState(null);

    const markRead = (m) => {
        if (!m.is_read) router.put(route('admin.messages.update', m.id), {}, { preserveScroll: true });
    };

    const handleConfirmDelete = () => {
        if (deletingItem) {
            router.delete(route('admin.messages.destroy', deletingItem.id));
        }
    };

    return (
        <AdminLayout title="Messages reçus">
            <Head title="Messages" />
            <div className="space-y-3">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        onClick={() => markRead(m)}
                        className={`cursor-pointer rounded-xl border p-4 shadow-sm dark:shadow-none ${
                            m.is_read
                                ? 'border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60'
                                : 'border-yolk-500/50 bg-yolk-500/10 dark:border-yolk-600/50 dark:bg-yolk-500/5'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-sand-100">{m.name} <span className="font-normal text-gray-400 dark:text-sand-500">— {m.email}</span></p>
                                {m.phone && <p className="text-xs text-gray-400 dark:text-sand-500">{m.phone}</p>}
                                {m.subject && <p className="mt-1 text-sm text-gray-700 dark:text-sand-300">Sujet : {m.subject}</p>}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingItem(m);
                                }}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-clay-500 transition hover:border-clay-300 hover:bg-clay-50 dark:border-soil-700 dark:bg-soil-800 dark:text-clay-400 dark:hover:bg-soil-700"
                                aria-label={`Supprimer le message de ${m.name}`}
                                title="Supprimer"
                            >
                                <Icon name="trash" className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-3 whitespace-pre-line text-sm text-gray-600 dark:text-sand-300">{m.message}</p>
                        <p className="mt-3 text-xs text-gray-400 dark:text-sand-500">{new Date(m.created_at).toLocaleString('fr-FR')}</p>
                    </div>
                ))}
                {messages.length === 0 && <p className="text-sm text-gray-500 dark:text-sand-500">Aucun message reçu pour le moment.</p>}
            </div>

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer ce message"
                message={`Êtes-vous sûr de vouloir supprimer le message de « ${deletingItem?.name} » ?`}
                confirmText="Supprimer"
            />
        </AdminLayout>
    );
}
