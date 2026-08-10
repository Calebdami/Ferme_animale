import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';

export default function Faq({ page }) {
    return (
        <PublicLayout>
            <Head title={page?.title || 'FAQ'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Besoin d’aide" title={page?.title || 'Questions fréquentes'} subtitle={page?.subtitle} />
                <div className="prose prose-invert mt-8 max-w-2xl whitespace-pre-line text-sand-300">
                    {page?.content}
                </div>
            </Container>
        </PublicLayout>
    );
}
