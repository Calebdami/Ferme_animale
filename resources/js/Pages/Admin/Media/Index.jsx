import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, Select, TextInput } from '@/Components/Form/Field';
import ConfirmModal from '@/Components/ConfirmModal';

const collections = [
    { value: 'gallery', label: 'Galerie générale' },
    { value: 'facilities', label: 'Nos installations / locaux' },
    { value: 'quality', label: 'Qualité & Biosécurité' },
    { value: 'about', label: 'Qui sommes-nous / À propos' },
    { value: 'team', label: 'Équipe' },
];

export default function Index({ mediaItems }) {
    const [deletingItem, setDeletingItem] = useState(null);
    const { data, setData, post, processing, reset } = useForm({
        files: [],
        collection: 'gallery',
        title: '',
        alt_text: '',
    });

    const handleFilesChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setData('files', selectedFiles);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.media.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const handleConfirmDelete = () => {
        if (deletingItem) {
            router.delete(route('admin.media.destroy', deletingItem.id));
        }
    };

    return (
        <AdminLayout title="Photos & Vidéos (Galerie & Médias)">
            <Head title="Médias" />

            <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-5 sm:grid-cols-2 shadow-sm dark:shadow-none">
                <div className="sm:col-span-2">
                    <Label htmlFor="files">Sélectionner plusieurs photos et/ou vidéos en un coup</Label>
                    <input
                        id="files"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFilesChange}
                        className="block w-full text-xs text-gray-500 dark:text-sand-400 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 dark:file:bg-soil-800 file:px-3 file:py-2 file:text-gray-700 dark:file:text-sand-100"
                    />
                    {data.files.length > 0 && (
                        <p className="mt-1 text-xs text-yolk-500 font-medium">
                            ✓ {data.files.length} fichier(s) prêt(s) à être téléversé(s)
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="collection">Page / Emplacement d'affichage</Label>
                    <Select id="collection" value={data.collection} onChange={(e) => setData('collection', e.target.value)}>
                        {collections.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </Select>
                </div>
                <div>
                    <Label htmlFor="title">Titre / légende (optionnel)</Label>
                    <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                    <Button type="submit" disabled={processing || data.files.length === 0}>
                        {processing ? 'Téléversement en cours…' : `Ajouter ${data.files.length > 1 ? `les ${data.files.length} médias` : 'le média'}`}
                    </Button>
                </div>
            </form>

            <h2 className="mb-4 font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                Tous les médias téléversés ({mediaItems.length})
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {mediaItems.map((m) => (
                    <div key={m.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none flex flex-col justify-between">
                        <div className="aspect-square bg-gray-100 dark:bg-soil-800 overflow-hidden relative">
                            {m.type === 'video' ? (
                                <video src={m.url} controls className="h-full w-full object-cover" />
                            ) : (
                                <img src={m.url} alt={m.title || 'Média'} className="h-full w-full object-cover" />
                            )}
                            <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                                {m.type === 'video' ? '🎬 Vidéo' : '📷 Photo'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 border-t border-gray-100 dark:border-soil-800">
                            <span className="truncate text-xs font-medium text-gray-600 dark:text-sand-300">
                                {collections.find((c) => c.value === m.collection)?.label || m.collection}
                            </span>
                            <button onClick={() => setDeletingItem(m)} className="text-xs font-semibold text-clay-500 hover:underline shrink-0 ml-2">
                                Suppr.
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer ce média"
                message="Êtes-vous sûr de vouloir supprimer définitivement ce fichier média ?"
                confirmText="Supprimer"
                variant="danger"
            />
        </AdminLayout>
    );
}
