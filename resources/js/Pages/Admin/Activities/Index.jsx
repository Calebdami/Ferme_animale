import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Textarea, Toggle } from '@/Components/Form/Field';

const emptyForm = { title: '', icon: 'feather', description: '', position: 0, is_published: true };

export default function Index({ activities }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, reset } = useForm(emptyForm);

    const edit = (a) => {
        setEditingId(a.id);
        setData({ title: a.title, icon: a.icon || '', description: a.description || '', position: a.position, is_published: a.is_published });
    };

    const cancel = () => { setEditingId(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.activities.update', editingId), { onSuccess: cancel });
        } else {
            post(route('admin.activities.store'), { onSuccess: cancel });
        }
    };

    const destroy = (a) => {
        if (confirm(`Supprimer « ${a.title} » ?`)) router.delete(route('admin.activities.destroy', a.id));
    };

    return (
        <AdminLayout title="Nos activités">
            <Head title="Activités" />

            <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border border-soil-700 bg-soil-900/60 p-5 sm:grid-cols-2">
                <div>
                    <Label htmlFor="title">Titre</Label>
                    <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="icon">Icône (feather, shopping-bag, shield-check, syringe, chat, leaf)</Label>
                    <TextInput id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={2} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                </div>
                <Toggle checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} label="Visible sur le site" />
                <div className="flex items-end gap-3 sm:col-span-2">
                    <Button type="submit" disabled={processing}>{editingId ? 'Enregistrer' : 'Ajouter'}</Button>
                    {editingId && <Button type="button" variant="ghost" onClick={cancel}>Annuler</Button>}
                </div>
            </form>

            <div className="overflow-hidden rounded-xl border border-soil-700">
                {activities.map((a) => (
                    <div key={a.id} className="flex items-center justify-between border-b border-soil-800 p-4 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-sand-100">{a.title}</p>
                            <p className="text-xs text-sand-500">{a.is_published ? 'Visible' : 'Masqué'}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => edit(a)} className="text-sm text-yolk-400 hover:underline">Modifier</button>
                            <button onClick={() => destroy(a)} className="text-sm text-clay-500 hover:underline">Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
