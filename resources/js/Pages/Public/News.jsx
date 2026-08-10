import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';

export default function News({ articles }) {
    return (
        <PublicLayout>
            <Head title="Actualités" />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="À la une" title="Actualités de la ferme" />
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.data.map((article) => (
                        <Link key={article.id} href={route('news.show', article.slug)} className="group overflow-hidden rounded-xl border border-soil-700 bg-soil-900/60">
                            <div className="aspect-video overflow-hidden bg-soil-800">
                                {article.cover_image_url && (
                                    <img src={article.cover_image_url} className="h-full w-full object-cover transition group-hover:scale-105" />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-display text-base font-semibold text-sand-100">{article.title}</h3>
                                {article.excerpt && <p className="mt-1 text-sm text-sand-500">{article.excerpt}</p>}
                            </div>
                        </Link>
                    ))}
                    {articles.data.length === 0 && <p className="col-span-full py-10 text-center text-sand-500">Aucun article pour le moment.</p>}
                </div>

                {articles.links?.length > 3 && (
                    <div className="mt-10 flex flex-wrap justify-center gap-2">
                        {articles.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || ''}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3 py-1.5 text-sm ${link.active ? 'bg-yolk-500 text-soil-950' : 'text-sand-400 hover:text-yolk-400'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </PublicLayout>
    );
}
