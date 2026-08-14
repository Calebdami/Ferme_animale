import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Toggle } from '@/Components/Form/Field';
import FocalPointPicker from '@/Components/FocalPointPicker';
import RichTextEditor from '@/Components/RichTextEditor';

export default function Form({ article }) {
    const editing = !!article;
    const { data, setData, post, processing } = useForm({
        _method: editing ? 'put' : undefined,
        title: article?.title || '',
        excerpt: article?.excerpt || '',
        content: article?.content || '',
        is_published: article?.is_published ?? true,
        cover_image: null,
        focal_x: article?.focal_x ?? 50,
        focal_y: article?.focal_y ?? 50,
        zoom: article?.zoom ?? 1,
    });

    const [localPreview, setLocalPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (localPreview) URL.revokeObjectURL(localPreview);
        setLocalPreview(URL.createObjectURL(file));
        setData('cover_image', file);
    };

    const handleFocalChange = ({ focalX, focalY, zoom }) => {
        setData((prev) => ({
            ...prev,
            focal_x: focalX,
            focal_y: focalY,
            zoom: zoom,
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => {
                if (localPreview) URL.revokeObjectURL(localPreview);
                setLocalPreview(null);
            },
        };
        if (editing) {
            post(route('admin.news.update', article.id), options);
        } else {
            post(route('admin.news.store'), options);
        }
    };

    const previewSrc = localPreview || article?.cover_image_url || null;

    return (
        <AdminLayout title={editing ? `Modifier : ${article.title}` : 'Nouvel article'}>
            <Head title={editing ? 'Modifier un article' : 'Nouvel article'} />
            <form onSubmit={submit} className="max-w-2xl space-y-5">
                <div>
                    <Label htmlFor="title">Titre</Label>
                    <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="excerpt">Résumé (affiché dans les listes)</Label>
                    <TextInput id="excerpt" value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} />
                </div>

                {/* Éditeur de texte riche */}
                <RichTextEditor
                    label="Contenu de l'article"
                    value={data.content}
                    onChange={(html) => setData('content', html)}
                />

                <div>
                    <Label htmlFor="cover_image">Image de couverture</Label>

                    <label
                        htmlFor="cover_image"
                        className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-soil-600 bg-gray-50 dark:bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-gray-100 dark:hover:bg-soil-800"
                    >
                        <span className="text-xs text-yolk-500">📷</span>
                        <span className="text-xs text-gray-500 dark:text-sand-400">
                            {localPreview ? 'Changer le fichier sélectionné' : previewSrc ? "Remplacer l'image actuelle" : 'Choisir une image de couverture'}
                        </span>
                        <input
                            id="cover_image"
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
                            onChange={handleFocalChange}
                            label="Zone de cadrage & Zoom"
                        />
                    )}
                </div>

                <Toggle
                    checked={data.is_published}
                    onChange={(e) => setData('is_published', e.target.checked)}
                    label="Publier l'article"
                />
                <Button type="submit" disabled={processing}>
                    {processing ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Publier'}
                </Button>
            </form>
        </AdminLayout>
    );
}
