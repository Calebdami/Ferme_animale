import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Toggle } from '@/Components/Form/Field';
import ConfirmModal from '@/Components/ConfirmModal';
import RichTextEditor from '@/Components/RichTextEditor';
import FocalPointPicker from '@/Components/FocalPointPicker';
import Icon from '@/Components/Icon';

const emptyForm = {
    question: '',
    answer: '',
    image: null,
    focal_x: 50,
    focal_y: 50,
    zoom: 1,
    position: 0,
    is_published: true,
};

export default function Index({ faqs }) {
    const [editingId, setEditingId] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [localPreview, setLocalPreview] = useState(null);

    const { data, setData, post, put, processing, reset } = useForm(emptyForm);

    const edit = (faq) => {
        setEditingId(faq.id);
        setLocalPreview(null);
        setData({
            question: faq.question,
            answer: faq.answer || '',
            image: null,
            focal_x: faq.focal_x ?? 50,
            focal_y: faq.focal_y ?? 50,
            zoom: faq.zoom ?? 1,
            position: faq.position ?? 0,
            is_published: faq.is_published,
        });
    };

    const cancel = () => {
        setEditingId(null);
        if (localPreview) URL.revokeObjectURL(localPreview);
        setLocalPreview(null);
        reset();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (localPreview) URL.revokeObjectURL(localPreview);
        setLocalPreview(URL.createObjectURL(file));
        setData('image', file);
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => cancel(),
        };

        if (editingId) {
            post(route('admin.faq.update', editingId) + '?_method=PUT', options);
        } else {
            post(route('admin.faq.store'), options);
        }
    };

    const handleConfirmDelete = () => {
        if (deletingItem) {
            router.delete(route('admin.faq.destroy', deletingItem.id));
        }
    };

    const currentFaq = editingId ? faqs.find((f) => f.id === editingId) : null;
    const previewSrc = localPreview || currentFaq?.image_url || null;

    return (
        <AdminLayout title="Foire Aux Questions (FAQ)">
            <Head title="Gestion de la FAQ" />

            <form onSubmit={submit} className="mb-8 max-w-3xl space-y-5 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 shadow-sm dark:shadow-none">
                <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                    {editingId ? 'Modifier la question' : 'Ajouter une nouvelle question à la FAQ'}
                </h2>

                <div>
                    <Label htmlFor="question">Question</Label>
                    <TextInput
                        id="question"
                        value={data.question}
                        onChange={(e) => setData('question', e.target.value)}
                        placeholder="Ex : Comment puis-je passer commande ?"
                    />
                </div>

                <RichTextEditor
                    label="Réponse détaillée"
                    value={data.answer}
                    onChange={(html) => setData('answer', html)}
                />

                <div>
                    <Label htmlFor="image">Image d'illustration (optionnelle)</Label>
                    <label
                        htmlFor="image"
                        className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-soil-600 bg-gray-50 dark:bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-gray-100 dark:hover:bg-soil-800"
                    >
                        <span className="text-xs text-yolk-500">📷</span>
                        <span className="text-xs text-gray-500 dark:text-sand-400">
                            {localPreview ? 'Changer le fichier sélectionné' : previewSrc ? 'Remplacer l\'image actuelle' : 'Ajouter une image'}
                        </span>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                        />
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
                            label="Zone de cadrage & Zoom d'image"
                        />
                    )}
                </div>

                <div className="flex items-center gap-6 pt-2">
                    <Toggle
                        checked={data.is_published}
                        onChange={(e) => setData('is_published', e.target.checked)}
                        label="Visible sur le site"
                    />
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Ajouter la question'}
                    </Button>
                    {editingId && (
                        <Button type="button" variant="ghost" onClick={cancel}>
                            Annuler
                        </Button>
                    )}
                </div>
            </form>

            <h2 className="mb-4 font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                Liste des questions ({faqs.length})
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none divide-y divide-gray-100 dark:divide-soil-800">
                {faqs.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500 dark:text-sand-500">
                        Aucune question FAQ n'a été ajoutée pour le moment.
                    </div>
                ) : (
                    faqs.map((faq) => (
                        <div key={faq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-gray-50/50 dark:hover:bg-soil-800/30 transition">
                            <div className="flex items-start gap-4">
                                {faq.image_url && (
                                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800">
                                        <img
                                            src={faq.image_url}
                                            alt={faq.question}
                                            className="h-full w-full object-cover"
                                            style={{
                                                objectPosition: `${faq.focal_x ?? 50}% ${faq.focal_y ?? 50}%`,
                                                transform: `scale(${faq.zoom ?? 1})`,
                                            }}
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-sm text-gray-900 dark:text-sand-100">{faq.question}</p>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-sand-300 line-clamp-2 prose-content" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${faq.is_published ? 'bg-pasture-500/15 text-pasture-600 dark:text-pasture-400' : 'bg-gray-100 dark:bg-soil-800 text-gray-400'}`}>
                                    {faq.is_published ? 'Visible' : 'Masquée'}
                                </span>
                                <button
                                    onClick={() => edit(faq)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-yolk-600 transition hover:border-yolk-300 hover:bg-yolk-50 dark:border-soil-700 dark:bg-soil-800 dark:text-yolk-400 dark:hover:bg-soil-700"
                                    aria-label={`Modifier ${faq.question}`}
                                    title="Modifier"
                                >
                                    <Icon name="pencil" className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setDeletingItem(faq)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-clay-500 transition hover:border-clay-300 hover:bg-clay-50 dark:border-soil-700 dark:bg-soil-800 dark:text-clay-400 dark:hover:bg-soil-700"
                                    aria-label={`Supprimer ${faq.question}`}
                                    title="Supprimer"
                                >
                                    <Icon name="trash" className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ConfirmModal
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer cette question"
                message={`Êtes-vous sûr de vouloir supprimer la question « ${deletingItem?.question} » ?`}
                confirmText="Supprimer"
                variant="danger"
            />
        </AdminLayout>
    );
}
