import { Link } from '@inertiajs/react';

const categoryLabels = {
    chair: 'Chair',
    ponte: 'Ponte',
    reproducteur: 'Reproducteur',
    pintade: 'Pintade',
    dindon: 'Dindon',
    canard: 'Canard',
    autre: 'Rustique',
};

export default function PoultryCard({ poultryType }) {
    return (
        <Link
            href={route('poultry.show', poultryType.slug)}
            className="group flex flex-col overflow-hidden rounded-xl border border-soil-700 bg-soil-900/60 transition hover:border-yolk-600/60"
        >
            <div className="aspect-[4/3] w-full overflow-hidden bg-soil-800">
                {poultryType.image_url ? (
                    <img
                        src={poultryType.image_url}
                        alt={poultryType.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sand-500">Photo à venir</div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <span className="mb-1 font-mono text-[11px] uppercase tracking-wider text-pasture-400">
                    {categoryLabels[poultryType.category] || poultryType.category}
                </span>
                <h3 className="font-display text-base font-semibold text-sand-100">{poultryType.name}</h3>
                {poultryType.available_ages && (
                    <p className="mt-2 text-xs text-sand-500">Disponible : {poultryType.available_ages}</p>
                )}
                {!poultryType.is_available && (
                    <span className="mt-2 inline-block w-fit rounded-full bg-clay-500/15 px-2 py-0.5 text-[11px] text-clay-500">
                        Indisponible
                    </span>
                )}
            </div>
        </Link>
    );
}
