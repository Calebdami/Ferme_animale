import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Textarea, Toggle } from '@/Components/Form/Field';

export default function Edit({ page }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: page.title || '',
        subtitle: page.subtitle || '',
        content: page.content || '',
        meta_description: page.meta_description || '',
        is_published: page.is_published,
        hero_image: null,
    });

    const [localPreview, setLocalPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (localPreview) URL.revokeObjectURL(localPreview);
        setLocalPreview(URL.createObjectURL(file));
        setData('hero_image', file);
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
                <div>
                    <Label htmlFor="content">Contenu</Label>
                    <Textarea id="content" rows={10} value={data.content} onChange={(e) => setData('content', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="meta_description">Description SEO (courte)</Label>
                    <TextInput id="meta_description" value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="hero_image">Image d'illustration</Label>

                    {previewSrc && (
                        <div className="relative mb-2 overflow-hidden rounded-lg border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800">
                            <img src={previewSrc} className="h-40 w-full object-cover" alt="Aperçu" />
                            {localPreview && (
                                <span className="absolute right-2 top-2 rounded-full bg-yolk-500 px-2 py-0.5 text-[10px] font-semibold text-soil-950">
                                    Non enregistré
                                </span>
                            )}
                        </div>
                    )}

                    <label
                        htmlFor="hero_image"
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-soil-600 bg-gray-50 dark:bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-gray-100 dark:hover:bg-soil-800"
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
