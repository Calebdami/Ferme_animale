import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';

export default function PoultryShow({ poultryType }) {
    return (
        <PublicLayout>
            <Head title={poultryType.name} />
            <Container className="py-14 sm:py-20">
                <Link href={route('poultry.index')} className="text-sm text-sand-500 hover:text-yolk-400">← Retour au catalogue</Link>

                <div className="mt-6 grid gap-8 lg:grid-cols-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl border border-soil-700 bg-soil-800">
                        {poultryType.image_url ? (
                            <img src={poultryType.image_url} alt={poultryType.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sand-500">Photo à venir</div>
                        )}
                    </div>
                    <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-pasture-400">{poultryType.category}</span>
                        <h1 className="mt-2 font-display text-3xl font-semibold text-sand-100">{poultryType.name}</h1>
                        {!poultryType.is_available && (
                            <span className="mt-3 inline-block rounded-full bg-clay-500/15 px-3 py-1 text-xs text-clay-500">
                                Actuellement indisponible
                            </span>
                        )}
                        {poultryType.description && <p className="mt-4 text-sand-300">{poultryType.description}</p>}

                        <dl className="mt-6 space-y-3 border-t border-soil-800 pt-6 text-sm">
                            {poultryType.origin && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-sand-500">Origine</dt>
                                    <dd className="text-right text-sand-200">{poultryType.origin}</dd>
                                </div>
                            )}
                            {poultryType.characteristics && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-sand-500">Caractéristiques</dt>
                                    <dd className="text-right text-sand-200">{poultryType.characteristics}</dd>
                                </div>
                            )}
                            {poultryType.available_ages && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-sand-500">Âges disponibles</dt>
                                    <dd className="text-right text-sand-200">{poultryType.available_ages}</dd>
                                </div>
                            )}
                            {poultryType.price && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-sand-500">Tarif</dt>
                                    <dd className="text-right text-sand-200">{poultryType.price}</dd>
                                </div>
                            )}
                        </dl>

                        <Link href={route('contact')} className="mt-8 inline-block rounded-lg bg-yolk-500 px-5 py-3 text-sm font-medium text-soil-950 hover:bg-yolk-400">
                            Demander une disponibilité
                        </Link>
                    </div>
                </div>
            </Container>
        </PublicLayout>
    );
}
