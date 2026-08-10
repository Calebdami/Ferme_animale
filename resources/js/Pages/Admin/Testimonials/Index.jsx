import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, Select, TextInput, Textarea, Toggle } from '@/Components/Form/Field';

const emptyForm = { author_name: '', author_role: '', content: '', rating: 5, is_published: true };

export default function Index({ testimonials }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, reset } = useForm(emptyForm);

    const edit = (t) => {
        setEditingId(t.id);
        setData({ author_name: t.author_name, author_role: t.author_role || '', content: t.content, rating: t.rating, is_published: t.is_published });
    };

    const cancel = () => { setEditingId(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.testimonials.update', editingId), { onSuccess: cancel });
        } else {
            post(route('admin.testimonials.store'), { onSuccess: cancel });
        }
    };

    const destroy = (t) => {
        if (confirm(`Supprimer le témoignage de « ${t.author_name} » ?`)) router.delete(route('admin.testimonials.destroy', t.id));
    };

    return (
        <AdminLayout title="Témoignages clients">
            <Head title="Témoignages" />

            <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border border-soil-700 bg-soil-900/60 p-5 sm:grid-cols-2">
                <div>
                    <Label htmlFor="author_name">Nom</Label>
                    <TextInput id="author_name" value={data.author_name} onChange={(e) => setData('author_name', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="author_role">Fonction / rôle</Label>
                    <TextInput id="author_role" value={data.author_role} onChange={(e) => setData('author_role', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                    <Label htmlFor="content">Témoignage</Label>
                    <Textarea id="content" rows={3} value={data.content} onChange={(e) => setData('content', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="rating">Note</Label>
                    <Select id="rating" value={data.rating} onChange={(e) => setData('rating', Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} étoiles</option>)}
                    </Select>
                </div>
                <Toggle checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} label="Visible sur le site" />
                <div className="flex items-end gap-3 sm:col-span-2">
                    <Button type="submit" disabled={processing}>{editingId ? 'Enregistrer' : 'Ajouter'}</Button>
                    {editingId && <Button type="button" variant="ghost" onClick={cancel}>Annuler</Button>}
                </div>
            </form>

            <div className="overflow-hidden rounded-xl border border-soil-700">
                {testimonials.map((t) => (
                    <div key={t.id} className="flex items-center justify-between border-b border-soil-800 p-4 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-sand-100">{t.author_name}</p>
                            <p className="line-clamp-1 text-xs text-sand-500">{t.content}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => edit(t)} className="text-sm text-yolk-400 hover:underline">Modifier</button>
                            <button onClick={() => destroy(t)} className="text-sm text-clay-500 hover:underline">Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
