import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';

export default function Facilities({ page, photos }) {
    return (
        <PublicLayout>
            <Head title={page?.title || 'Nos locaux'} />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Nos infrastructures" title={page?.title || 'Nos locaux'} subtitle={page?.subtitle} />
                {page?.content && <p className="mt-6 max-w-2xl whitespace-pre-line text-sand-400">{page.content}</p>}
                {photos.length > 0 && (
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {photos.map((m) => (
                            <div key={m.id} className="overflow-hidden rounded-xl border border-soil-700 bg-soil-900/60">
                                {m.type === 'video' ? (
                                    <video src={m.url} controls className="aspect-video w-full object-cover" />
                                ) : (
                                    <img src={m.url} alt={m.alt_text || m.title} className="aspect-video w-full object-cover" />
                                )}
                                {m.title && <p className="p-3 text-sm text-sand-300">{m.title}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </PublicLayout>
    );
}
