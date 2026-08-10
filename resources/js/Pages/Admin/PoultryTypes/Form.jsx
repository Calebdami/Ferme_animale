import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, Select, TextInput, Textarea, Toggle } from '@/Components/Form/Field';

const categories = ['chair', 'ponte', 'reproducteur', 'pintade', 'dindon', 'canard', 'autre'];

export default function Form({ poultryType }) {
    const editing = !!poultryType;
    const { data, setData, post, processing } = useForm({
        _method: editing ? 'put' : undefined,
        name: poultryType?.name || '',
        category: poultryType?.category || 'chair',
        origin: poultryType?.origin || '',
        description: poultryType?.description || '',
        characteristics: poultryType?.characteristics || '',
        available_ages: poultryType?.available_ages || '',
        price: poultryType?.price || '',
        is_available: poultryType?.is_available ?? true,
        position: poultryType?.position ?? 0,
        image: null,
    });

    const [localPreview, setLocalPreview] = useState(null);

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
            onSuccess: () => {
                if (localPreview) URL.revokeObjectURL(localPreview);
                setLocalPreview(null);
            },
        };
        if (editing) {
            post(route('admin.poultry-types.update', poultryType.id), options);
        } else {
            post(route('admin.poultry-types.store'), options);
        }
    };

    const previewSrc = localPreview || poultryType?.image_url || null;

    return (
        <AdminLayout title={editing ? `Modifier : ${poultryType.name}` : 'Ajouter une race'}>
            <Head title={editing ? 'Modifier une race' : 'Ajouter une race'} />
            <form onSubmit={submit} className="max-w-2xl space-y-5">
                <div>
                    <Label htmlFor="name">Nom de la race</Label>
                    <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="category">Catégorie</Label>
                        <Select id="category" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="origin">Origine</Label>
                        <TextInput id="origin" value={data.origin} onChange={(e) => setData('origin', e.target.value)} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="characteristics">Caractéristiques</Label>
                    <Textarea id="characteristics" rows={3} value={data.characteristics} onChange={(e) => setData('characteristics', e.target.value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="available_ages">Âges disponibles</Label>
                        <TextInput id="available_ages" value={data.available_ages} onChange={(e) => setData('available_ages', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="price">Tarif</Label>
                        <TextInput id="price" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="image">Photo</Label>

                    {previewSrc && (
                        <div className="relative mb-2 overflow-hidden rounded-lg border border-soil-700">
                            <img src={previewSrc} className="h-40 w-full object-cover" alt={data.name || 'Aperçu'} />
                            {localPreview && (
                                <span className="absolute right-2 top-2 rounded-full bg-yolk-500 px-2 py-0.5 text-[10px] font-semibold text-soil-950">
                                    Non enregistré
                                </span>
                            )}
                        </div>
                    )}

                    <label
                        htmlFor="image"
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-soil-600 bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-soil-800"
                    >
                        <span className="text-xs text-yolk-400">📷</span>
                        <span className="text-xs text-sand-400">
                            {localPreview ? 'Changer le fichier sélectionné' : previewSrc ? 'Remplacer la photo actuelle' : 'Choisir une photo'}
                        </span>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                        />
                    </label>
                </div>

                <Toggle
                    checked={data.is_available}
                    onChange={(e) => setData('is_available', e.target.checked)}
                    label="Disponible à la vente"
                />
                <Button type="submit" disabled={processing}>
                    {processing ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Créer la race'}
                </Button>
            </form>
        </AdminLayout>
    );
}
