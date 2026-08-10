import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import PoultryCard from '@/Components/PoultryCard';

const categories = [
    { value: 'all', label: 'Toutes' },
    { value: 'chair', label: 'Chair' },
    { value: 'ponte', label: 'Ponte' },
    { value: 'reproducteur', label: 'Reproducteur' },
    { value: 'pintade', label: 'Pintade' },
    { value: 'dindon', label: 'Dindon' },
    { value: 'canard', label: 'Canard' },
    { value: 'autre', label: 'Rustique / autre' },
];

export default function Poultry({ page, poultryTypes }) {
    const [filter, setFilter] = useState('all');

    const filtered = useMemo(
        () => (filter === 'all' ? poultryTypes : poultryTypes.filter((p) => p.category === filter)),
        [filter, poultryTypes]
    );

    return (
        <PublicLayout>
            <Head title={page?.title || 'Races de poussins'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Catalogue" title={page?.title || 'Nos races de poussins et volailles'} subtitle={page?.subtitle} />

                <div className="mt-8 flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => setFilter(c.value)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                                filter === c.value
                                    ? 'border-yolk-500 bg-yolk-500/10 text-yolk-400'
                                    : 'border-soil-700 text-sand-400 hover:border-yolk-600'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((p) => <PoultryCard key={p.id} poultryType={p} />)}
                    {filtered.length === 0 && (
                        <p className="col-span-full py-10 text-center text-sand-500">Aucune race dans cette catégorie pour le moment.</p>
                    )}
                </div>
            </Container>
        </PublicLayout>
    );
}
