import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/Form/Field';
import ConfirmModal from '@/Components/ConfirmModal';
import Icon from '@/Components/Icon';

export default function Index({ poultryTypes }) {
    const [deletingItem, setDeletingItem] = useState(null);

    const handleConfirmDelete = () => {
        if (deletingItem) {
            router.delete(route('admin.poultry-types.destroy', deletingItem.id));
        }
    };

    return (
        <AdminLayout title="Types de volailles">
            <Head title="Types de volailles" />
            <div className="mb-5 flex justify-end">
                <Link href={route('admin.poultry-types.create')}>
                    <Button>+ Ajouter une race</Button>
                </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none">
                {poultryTypes.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 border-b border-gray-100 dark:border-soil-800 p-4 last:border-0">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-soil-800">
                            {p.image_url ? (
                                <img src={p.image_url} className="h-full w-full object-cover" />
                            ) : p.image && (
                                <img src={`/storage/${p.image}`} className="h-full w-full object-cover" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-sand-100">{p.name}</p>
                            <p className="text-xs text-gray-400 dark:text-sand-500">{p.category} · {p.is_available ? 'Disponible' : 'Indisponible'}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route('admin.poultry-types.edit', p.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-yolk-600 transition hover:border-yolk-300 hover:bg-yolk-50 dark:border-soil-700 dark:bg-soil-800 dark:text-yolk-400 dark:hover:bg-soil-700"
                                aria-label={`Modifier ${p.name}`}
                                title="Modifier"
                            >
                                <Icon name="pencil" className="h-4 w-4" />
                            </Link>
                            <button
                                onClick={() => setDeletingItem(p)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-clay-500 transition hover:border-clay-300 hover:bg-clay-50 dark:border-soil-700 dark:bg-soil-800 dark:text-clay-400 dark:hover:bg-soil-700"
                                aria-label={`Supprimer ${p.name}`}
                                title="Supprimer"
                            >
                                <Icon name="trash" className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {poultryTypes.length === 0 && <p className="p-5 text-sm text-gray-500 dark:text-sand-500">Aucune race enregistrée pour le moment.</p>}
            </div>

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer cette race"
                message={`Êtes-vous sûr de vouloir supprimer la race « ${deletingItem?.name} » ? Cette action est irréversible.`}
                confirmText="Supprimer"
            />
        </AdminLayout>
    );
}
