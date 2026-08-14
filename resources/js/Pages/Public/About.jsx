import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import StatCard from '@/Components/StatCard';

export default function About({ page, settings, team }) {
    return (
        <PublicLayout>
            <Head title={page?.title || 'Qui sommes-nous'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Notre histoire" title={page?.title || 'Qui sommes-nous'} subtitle={page?.subtitle} />

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <StatCard value={settings.founding_year} label="Année de fondation" />
                    <StatCard value={settings.team_size} label="Membres de l'équipe" />
                    <StatCard value={settings.farm_area} label="Superficie exploitée" />
                </div>

                <div className="mt-10 max-w-2xl whitespace-pre-line text-gray-600 dark:text-sand-300">
                    {page?.content}
                </div>

                {team.length > 0 && (
                    <div className="mt-14">
                        <h2 className="mb-6 font-display text-xl font-semibold text-gray-900 dark:text-sand-100">Notre équipe</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {team.map((m) => (
                                <div key={m.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60">
                                    <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-soil-800">
                                        <img src={m.url} alt={m.alt_text || m.title} className="h-full w-full object-cover" />
                                    </div>
                                    {m.title && <p className="p-2 text-center text-xs text-gray-600 dark:text-sand-300">{m.title}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </PublicLayout>
    );
}
