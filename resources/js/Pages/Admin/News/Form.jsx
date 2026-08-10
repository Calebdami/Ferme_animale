import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Textarea, Toggle } from '@/Components/Form/Field';

export default function Form({ article }) {
    const editing = !!article;
    const { data, setData, post, processing } = useForm({
        _method: editing ? 'put' : undefined,
        title: article?.title || '',
        excerpt: article?.excerpt || '',
        content: article?.content || '',
        is_published: article?.is_published ?? true,
        cover_image: null,
    });

    const [localPreview, setLocalPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (localPreview) URL.revokeObjectURL(localPreview);
        setLocalPreview(URL.createObjectURL(file));
        setData('cover_image', file);
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
                <div>
                    <Label htmlFor="content">Contenu de l'article</Label>
                    <Textarea id="content" rows={10} value={data.content} onChange={(e) => setData('content', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="cover_image">Image de couverture</Label>

                    {previewSrc && (
                        <div className="relative mb-2 overflow-hidden rounded-lg border border-soil-700">
                            <img src={previewSrc} className="h-40 w-full object-cover" alt="Aperçu" />
                            {localPreview && (
                                <span className="absolute right-2 top-2 rounded-full bg-yolk-500 px-2 py-0.5 text-[10px] font-semibold text-soil-950">
                                    Non enregistré
                                </span>
                            )}
                        </div>
                    )}

                    <label
                        htmlFor="cover_image"
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-soil-600 bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-soil-800"
                    >
                        <span className="text-xs text-yolk-400">📷</span>
                        <span className="text-xs text-sand-400">
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
