import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/Form/Field';

export default function Index({ articles }) {
    const destroy = (a) => {
        if (confirm(`Supprimer « ${a.title} » ?`)) router.delete(route('admin.news.destroy', a.id));
    };

    return (
        <AdminLayout title="Actualités">
            <Head title="Actualités" />
            <div className="mb-5 flex justify-end">
                <Link href={route('admin.news.create')}><Button>+ Nouvel article</Button></Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-soil-700">
                {articles.map((a) => (
                    <div key={a.id} className="flex items-center justify-between border-b border-soil-800 p-4 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-sand-100">{a.title}</p>
                            <p className="text-xs text-sand-500">{a.is_published ? 'Publié' : 'Brouillon'}</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href={route('admin.news.edit', a.id)} className="text-sm text-yolk-400 hover:underline">Modifier</Link>
                            <button onClick={() => destroy(a)} className="text-sm text-clay-500 hover:underline">Supprimer</button>
                        </div>
                    </div>
                ))}
                {articles.length === 0 && <p className="p-5 text-sm text-sand-500">Aucun article pour le moment.</p>}
            </div>
        </AdminLayout>
    );
}
