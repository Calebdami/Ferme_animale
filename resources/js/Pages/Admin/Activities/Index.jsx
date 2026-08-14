import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Textarea, Toggle } from '@/Components/Form/Field';
import ConfirmModal from '@/Components/ConfirmModal';
import RichTextEditor from '@/Components/RichTextEditor';
import FocalPointPicker from '@/Components/FocalPointPicker';
import Icon from '@/Components/Icon';

const emptyForm = {
    title: '',
    icon: 'feather',
    description: '',
    content: '',
    cover_image: null,
    media_files: [],
    focal_x: 50,
    focal_y: 50,
    zoom: 1,
    position: 0,
    is_published: true,
};

export default function Index({ activities }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [localPreview, setLocalPreview] = useState(null);

    const { data, setData, post, processing, reset } = useForm(emptyForm);

    const openAdd = () => {
        setEditingId(null);
        setLocalPreview(null);
        reset();
        setShowForm(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const edit = (a) => {
        setEditingId(a.id);
        setLocalPreview(null);
        setData({
            title: a.title,
            icon: a.icon || '',
            description: a.description || '',
            content: a.content || '',
            cover_image: null,
            media_files: [],
            focal_x: a.focal_x ?? 50,
            focal_y: a.focal_y ?? 50,
            zoom: a.zoom ?? 1,
            position: a.position ?? 0,
            is_published: a.is_published,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancel = () => {
        setEditingId(null);
        if (localPreview) URL.revokeObjectURL(localPreview);
        setLocalPreview(null);
        reset();
        setShowForm(false);
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (localPreview) URL.revokeObjectURL(localPreview);
        setLocalPreview(URL.createObjectURL(file));
        setData('cover_image', file);
    };

    const handleMediaFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setData('media_files', files);
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => cancel(),
        };

        if (editingId) {
            post(route('admin.activities.update', editingId) + '?_method=PUT', options);
        } else {
            post(route('admin.activities.store'), options);
        }
    };

    const handleConfirmDelete = () => {
        if (deletingItem) {
            router.delete(route('admin.activities.destroy', deletingItem.id), {
                onSuccess: () => setDeletingItem(null),
            });
        }
    };

    const handleDeleteMedia = (mediaId) => {
        if (confirm('Supprimer ce fichier média ?')) {
            router.delete(route('admin.media.destroy', mediaId));
        }
    };

    const currentActivity = editingId ? activities.find((a) => a.id === editingId) : null;
    const previewSrc = localPreview || currentActivity?.cover_image_url || null;

    return (
        <AdminLayout title="Nos activités">
            <Head title="Activités" />

            {/* Bouton Ajouter */}
            {!showForm && (
                <div className="mb-6">
                    <Button type="button" onClick={openAdd}>
                        + Ajouter une nouvelle activité
                    </Button>
                </div>
            )}

            {/* Formulaire Ajout / Modification */}
            {showForm && (
                <form onSubmit={submit} className="mb-10 space-y-5 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                            {editingId ? "✏️ Modifier l'activité" : '➕ Ajouter une nouvelle activité'}
                        </h2>
                        <button type="button" onClick={cancel} className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-sand-200">
                            ✕ Annuler
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="title">Titre de l'activité</Label>
                            <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="icon">Icône (feather, shopping-bag, shield-check, syringe, chat, leaf)</Label>
                            <TextInput id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Résumé court (affiché sur la carte d'accueil)</Label>
                        <Textarea id="description" rows={2} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>

                    <RichTextEditor
                        label="Description complète du déroulement de l'activité (page détail — optionnel)"
                        value={data.content}
                        onChange={(html) => setData('content', html)}
                    />

                    {/* Photo de couverture */}
                    <div>
                        <Label htmlFor="cover_image">Photo principale (affichée sur la carte)</Label>
                        <label
                            htmlFor="cover_image"
                            className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-soil-600 bg-gray-50 dark:bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-gray-100 dark:hover:bg-soil-800"
                        >
                            <span className="text-xs text-yolk-500">📷</span>
                            <span className="text-xs text-gray-500 dark:text-sand-400">
                                {localPreview ? 'Changer la photo sélectionnée' : previewSrc ? 'Remplacer la photo principale' : 'Choisir la photo principale'}
                            </span>
                            <input id="cover_image" type="file" accept="image/*" onChange={handleCoverChange} className="sr-only" />
                        </label>

                        {previewSrc && (
                            <FocalPointPicker
                                src={previewSrc}
                                focalX={data.focal_x}
                                focalY={data.focal_y}
                                zoom={data.zoom}
                                onChange={({ focalX, focalY, zoom }) => {
                                    setData((prev) => ({ ...prev, focal_x: focalX, focal_y: focalY, zoom }));
                                }}
                                label="Zone de cadrage & Zoom pour la carte"
                            />
                        )}
                    </div>

                    {/* Upload multi-médias */}
                    <div>
                        <Label htmlFor="media_files">Ajouter des photos & vidéos additionnelles (page détail)</Label>
                        <label
                            htmlFor="media_files"
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-soil-600 bg-gray-50 dark:bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-gray-100 dark:hover:bg-soil-800"
                        >
                            <span className="text-xs text-yolk-500">🖼️ / 🎬</span>
                            <span className="text-xs text-gray-500 dark:text-sand-400">
                                {data.media_files.length > 0 ? `${data.media_files.length} fichier(s) sélectionné(s)` : 'Sélectionner plusieurs photos et/ou vidéos'}
                            </span>
                            <input
                                id="media_files"
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleMediaFilesChange}
                                className="sr-only"
                            />
                        </label>

                        {/* Médias existants en mode édition */}
                        {currentActivity?.media_list?.length > 0 && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-sand-400 uppercase">
                                    Médias actuels ({currentActivity.media_list.length}) :
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {currentActivity.media_list.map((m) => (
                                        <div key={m.id} className="relative group overflow-hidden rounded-lg border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800 aspect-square">
                                            {m.type === 'video' ? (
                                                <video src={m.url} className="h-full w-full object-cover" />
                                            ) : (
                                                <img src={m.url} alt="Média" className="h-full w-full object-cover" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteMedia(m.id)}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white font-semibold"
                                            >
                                                🗑️ Supprimer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <Toggle
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                            label="Visible sur le site"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-soil-800">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement…' : editingId ? "Enregistrer les modifications" : 'Ajouter l\'activité'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={cancel}>
                            Annuler
                        </Button>
                    </div>
                </form>
            )}

            {/* Liste de toutes les activités */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                    Liste des activités ({activities.length})
                </h2>
                {!showForm && (
                    <button onClick={openAdd} className="text-sm font-medium text-yolk-500 hover:underline">
                        + Ajouter
                    </button>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none divide-y divide-gray-100 dark:divide-soil-800">
                {activities.length === 0 && (
                    <p className="p-8 text-center text-sm text-gray-400 dark:text-sand-500">
                        Aucune activité pour l'instant. Cliquez sur "+ Ajouter" pour en créer une.
                    </p>
                )}
                {activities.map((a) => (
                    <div
                        key={a.id}
                        className={`flex items-center justify-between p-4 transition ${
                            editingId === a.id
                                ? 'bg-yolk-500/5 border-l-4 border-yolk-500'
                                : 'hover:bg-gray-50/50 dark:hover:bg-soil-800/30'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            {a.cover_image_url ? (
                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800">
                                    <img
                                        src={a.cover_image_url}
                                        alt={a.title}
                                        className="h-full w-full object-cover"
                                        style={{
                                            objectPosition: `${a.focal_x ?? 50}% ${a.focal_y ?? 50}%`,
                                            transform: `scale(${a.zoom ?? 1})`,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800 flex items-center justify-center text-gray-300 dark:text-soil-600">
                                    <Icon name={a.icon || 'feather'} className="h-5 w-5" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-sand-100">{a.title}</p>
                                <p className="text-xs text-gray-400 dark:text-sand-500">
                                    {a.is_published ? '🟢 Visible' : '⚫ Masqué'} • {a.media_list?.length || 0} média(s)
                                    {a.content ? ' • Détail complet' : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <button
                                onClick={() => edit(a)}
                                className={`text-sm font-medium hover:underline ${editingId === a.id ? 'text-yolk-600' : 'text-yolk-500'}`}
                            >
                                {editingId === a.id ? '✏️ En cours…' : 'Modifier'}
                            </button>
                            <button
                                onClick={() => setDeletingItem(a)}
                                className="text-sm font-medium text-clay-500 hover:underline"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer cette activité"
                message={`Êtes-vous sûr de vouloir supprimer l'activité « ${deletingItem?.title} » ? Cette action est irréversible.`}
                confirmText="Supprimer"
                variant="danger"
            />
        </AdminLayout>
    );
}
