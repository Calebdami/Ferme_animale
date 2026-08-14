import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Toggle } from '@/Components/Form/Field';
import FocalPointPicker from '@/Components/FocalPointPicker';
import RichTextEditor from '@/Components/RichTextEditor';

export default function Edit({ page }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: page.title || '',
        subtitle: page.subtitle || '',
        content: page.content || '',
        meta_description: page.meta_description || '',
        is_published: page.is_published,
        hero_image: null,
        hero_focal_x: page.hero_focal_x ?? 50,
        hero_focal_y: page.hero_focal_y ?? 50,
        hero_zoom: page.hero_zoom ?? 1,
    });

    const [localPreview, setLocalPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (localPreview) URL.revokeObjectURL(localPreview);
        setLocalPreview(URL.createObjectURL(file));
        setData('hero_image', file);
    };

    const handleFocalChange = ({ focalX, focalY, zoom }) => {
        setData((prev) => ({
            ...prev,
            hero_focal_x: focalX,
            hero_focal_y: focalY,
            hero_zoom: zoom,
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.pages.update', page.id), {
            forceFormData: true,
            onSuccess: () => {
                if (localPreview) URL.revokeObjectURL(localPreview);
                setLocalPreview(null);
            },
        });
    };

    const previewSrc = localPreview || page.hero_image_url || null;

    return (
        <AdminLayout title={`Modifier : ${page.title}`}>
            <Head title={`Modifier ${page.title}`} />
            <form onSubmit={submit} className="max-w-2xl space-y-5">
                <div>
                    <Label htmlFor="title">Titre</Label>
                    <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="subtitle">Sous-titre</Label>
                    <TextInput id="subtitle" value={data.subtitle} onChange={(e) => setData('subtitle', e.target.value)} />
                </div>

                {/* Éditeur de texte riche */}
                <RichTextEditor
                    label="Contenu de la page"
                    value={data.content}
                    onChange={(html) => setData('content', html)}
                />

                <div>
                    <Label htmlFor="meta_description">Description SEO (courte)</Label>
                    <TextInput id="meta_description" value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="hero_image">Image d'illustration</Label>

                    <label
                        htmlFor="hero_image"
                        className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-soil-600 bg-gray-50 dark:bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-gray-100 dark:hover:bg-soil-800"
                    >
                        <span className="text-xs text-yolk-500">📷</span>
                        <span className="text-xs text-gray-500 dark:text-sand-400">
                            {localPreview ? 'Changer le fichier sélectionné' : previewSrc ? "Remplacer l'image actuelle" : 'Choisir une image'}
                        </span>
                        <input
                            id="hero_image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                        />
                    </label>

                    {previewSrc && (
                        <FocalPointPicker
                            src={previewSrc}
                            focalX={data.hero_focal_x}
                            focalY={data.hero_focal_y}
                            zoom={data.hero_zoom}
                            onChange={handleFocalChange}
                            label="Zone d'affichage & Cadrage tactile"
                        />
                    )}
                </div>

                <Toggle
                    checked={data.is_published}
                    onChange={(e) => setData('is_published', e.target.checked)}
                    label="Page publiée sur le site"
                />
                <Button type="submit" disabled={processing}>
                    {processing ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
            </form>
        </AdminLayout>
    );
}
