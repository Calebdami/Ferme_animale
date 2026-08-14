import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import Icon from '@/Components/Icon';

const points = [
    'Dépistage sanitaire systématique avant la vente',
    'Protocoles de vaccination adaptés à chaque race',
    'Zone de quarantaine dédiée aux nouveaux arrivages',
    'Traçabilité complète de chaque lot',
    'Partenariat avec un laboratoire vétérinaire',
];

export default function Quality({ page }) {
    return (
        <PublicLayout>
            <Head title={page?.title || 'Qualité & biosécurité'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Notre engagement" title={page?.title || 'Qualité, sanitaire et biosécurité'} subtitle={page?.subtitle} />
                {page?.content && <p className="mt-6 max-w-2xl whitespace-pre-line text-gray-500 dark:text-sand-400">{page.content}</p>}
                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                    {points.map((p) => (
                        <li key={p} className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                            <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-pasture-500" />
                            <span className="text-sm text-gray-600 dark:text-sand-300">{p}</span>
                        </li>
                    ))}
                </ul>
            </Container>
        </PublicLayout>
    );
}
