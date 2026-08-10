import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';

export default function Gallery({ items }) {
    return (
        <PublicLayout>
            <Head title="Galerie" />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="En images" title="Galerie photos & vidéos" subtitle="La ferme, les volailles, les installations." />
                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((m) => (
                        <div key={m.id} className="aspect-square overflow-hidden rounded-xl border border-soil-700 bg-soil-900/60">
                            {m.type === 'video' ? (
                                <video src={m.url} controls className="h-full w-full object-cover" />
                            ) : (
                                <img src={m.url} alt={m.alt_text || m.title} className="h-full w-full object-cover" />
                            )}
                        </div>
                    ))}
                    {items.length === 0 && <p className="col-span-full py-10 text-center text-sand-500">La galerie sera bientôt garnie.</p>}
                </div>
            </Container>
        </PublicLayout>
    );
}
