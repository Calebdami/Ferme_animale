import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ pages }) {
    return (
        <AdminLayout title="Pages du site">
            <Head title="Pages" />
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none">
                {pages.map((p) => (
                    <Link
                        key={p.id}
                        href={route('admin.pages.edit', p.id)}
                        className="flex items-center justify-between border-b border-gray-100 dark:border-soil-800 p-4 last:border-0 hover:bg-gray-50 dark:hover:bg-soil-800/40"
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-sand-100">{p.title}</p>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-sand-500">/{p.slug}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${p.is_published ? 'bg-pasture-500/15 text-pasture-500 font-medium' : 'bg-clay-500/15 text-clay-500'}`}>
                            {p.is_published ? 'Publiée' : 'Masquée'}
                        </span>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
