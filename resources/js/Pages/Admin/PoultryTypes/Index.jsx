import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/Form/Field';

export default function Index({ poultryTypes }) {
    const destroy = (item) => {
        if (confirm(`Supprimer « ${item.name} » ?`)) {
            router.delete(route('admin.poultry-types.destroy', item.id));
        }
    };

    return (
        <AdminLayout title="Types de volailles">
            <Head title="Types de volailles" />
            <div className="mb-5 flex justify-end">
                <Link href={route('admin.poultry-types.create')}>
                    <Button>+ Ajouter une race</Button>
                </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-soil-700">
                {poultryTypes.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 border-b border-soil-800 p-4 last:border-0">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-soil-800">
                            {p.image && <img src={`/storage/${p.image}`} className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-sand-100">{p.name}</p>
                            <p className="text-xs text-sand-500">{p.category} · {p.is_available ? 'Disponible' : 'Indisponible'}</p>
                        </div>
                        <Link href={route('admin.poultry-types.edit', p.id)} className="text-sm text-yolk-400 hover:underline">Modifier</Link>
                        <button onClick={() => destroy(p)} className="text-sm text-clay-500 hover:underline">Supprimer</button>
                    </div>
                ))}
                {poultryTypes.length === 0 && <p className="p-5 text-sm text-sand-500">Aucune race enregistrée pour le moment.</p>}
            </div>
        </AdminLayout>
    );
}
