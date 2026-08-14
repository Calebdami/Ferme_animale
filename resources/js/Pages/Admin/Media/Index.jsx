import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, Select, TextInput } from '@/Components/Form/Field';
import ConfirmModal from '@/Components/ConfirmModal';

const collections = [
    { value: 'gallery', label: 'Galerie générale' },
    { value: 'facilities', label: 'Locaux / installations' },
    { value: 'team', label: 'Équipe' },
    { value: 'hero', label: 'Bannière' },
];

export default function Index({ mediaItems }) {
    const [deletingItem, setDeletingItem] = useState(null);
    const { data, setData, post, processing, reset } = useForm({
        file: null, collection: 'gallery', title: '', alt_text: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.media.store'), { forceFormData: true, onSuccess: () => reset() });
    };

    const handleConfirmDelete = () => {
        if (deletingItem) {
            router.delete(route('admin.media.destroy', deletingItem.id));
        }
    };

    return (
        <AdminLayout title="Photos & vidéos">
            <Head title="Médias" />

            <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-5 sm:grid-cols-2 shadow-sm dark:shadow-none">
                <div className="sm:col-span-2">
                    <Label htmlFor="file">Fichier (image ou vidéo)</Label>
                    <input
                        id="file"
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setData('file', e.target.files[0])}
                        className="block w-full text-xs text-gray-500 dark:text-sand-400 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 dark:file:bg-soil-800 file:px-3 file:py-2 file:text-gray-700 dark:file:text-sand-100"
                    />
                </div>
                <div>
                    <Label htmlFor="collection">Catégorie</Label>
                    <Select id="collection" value={data.collection} onChange={(e) => setData('collection', e.target.value)}>
                        {collections.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </Select>
                </div>
                <div>
                    <Label htmlFor="title">Titre / légende</Label>
                    <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                    <Button type="submit" disabled={processing || !data.file}>Ajouter le média</Button>
                </div>
            </form>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {mediaItems.map((m) => (
                    <div key={m.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none">
                        <div className="aspect-square bg-gray-100 dark:bg-soil-800">
                            {m.type === 'video' ? (
                                <video src={m.url} className="h-full w-full object-cover" />
                            ) : (
                                <img src={m.url} className="h-full w-full object-cover" />
                            )}
                        </div>
                        <div className="flex items-center justify-between p-2">
                            <span className="truncate text-xs text-gray-400 dark:text-sand-500">{collections.find((c) => c.value === m.collection)?.label}</span>
                            <button onClick={() => setDeletingItem(m)} className="text-xs text-clay-500 hover:underline">Suppr.</button>
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
            />
        </AdminLayout>
    );
}
