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
                {page?.content && <p className="mt-6 max-w-2xl whitespace-pre-line text-sand-400">{page.content}</p>}
                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                    {points.map((p) => (
                        <li key={p} className="flex items-start gap-3 rounded-xl border border-soil-700 bg-soil-900/60 p-4">
                            <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-pasture-400" />
                            <span className="text-sm text-sand-300">{p}</span>
                        </li>
                    ))}
                </ul>
            </Container>
        </PublicLayout>
    );
}
