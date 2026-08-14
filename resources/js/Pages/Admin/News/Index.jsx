import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/Form/Field';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Index({ articles }) {
    const [deletingItem, setDeletingItem] = useState(null);

    const handleConfirmDelete = () => {
        if (deletingItem) {
            router.delete(route('admin.news.destroy', deletingItem.id));
        }
    };

    return (
        <AdminLayout title="Actualités">
            <Head title="Actualités" />
            <div className="mb-5 flex justify-end">
                <Link href={route('admin.news.create')}><Button>+ Nouvel article</Button></Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none">
                {articles.map((a) => (
                    <div key={a.id} className="flex items-center justify-between border-b border-gray-100 dark:border-soil-800 p-4 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-sand-100">{a.title}</p>
                            <p className="text-xs text-gray-400 dark:text-sand-500">{a.is_published ? 'Publié' : 'Brouillon'}</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href={route('admin.news.edit', a.id)} className="text-sm text-yolk-500 hover:underline">Modifier</Link>
                            <button onClick={() => setDeletingItem(a)} className="text-sm text-clay-500 hover:underline">Supprimer</button>
                        </div>
                    </div>
                ))}
                {articles.length === 0 && <p className="p-5 text-sm text-gray-500 dark:text-sand-500">Aucun article pour le moment.</p>}
            </div>

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer cet article"
                message={`Êtes-vous sûr de vouloir supprimer l'article « ${deletingItem?.title} » ? Cette action est irréversible.`}
                confirmText="Supprimer"
            />
        </AdminLayout>
    );
}
