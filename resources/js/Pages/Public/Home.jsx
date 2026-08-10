import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import StatCard from '@/Components/StatCard';
import ActivityCard from '@/Components/ActivityCard';
import PoultryCard from '@/Components/PoultryCard';
import TestimonialCard from '@/Components/TestimonialCard';
import EggDivider from '@/Components/EggDivider';
import Eyebrow from '@/Components/Eyebrow';

export default function Home({ settings, activities, testimonials, news, featuredPoultry }) {
    return (
        <PublicLayout>
            <Head title="Accueil" />

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-soil-800">
                <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
                    <div>
                        <Eyebrow>Ferme avicole spécialisée</Eyebrow>
                        <h1 className="font-display text-4xl font-semibold leading-[1.1] text-sand-100 sm:text-5xl">
                            {settings.hero_title || 'Une volaille d’exception, du couvoir jusqu’à votre élevage'}
                        </h1>
                        <p className="mt-5 max-w-lg text-sand-400">
                            {settings.hero_subtitle}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href={route('poultry.index')} className="rounded-lg bg-yolk-500 px-5 py-3 text-center text-sm font-medium text-soil-950 hover:bg-yolk-400">
                                Voir nos races de poussins
                            </Link>
                            <Link href={route('contact')} className="rounded-lg border border-soil-700 px-5 py-3 text-center text-sm font-medium text-sand-100 hover:border-yolk-600">
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                    <div className="aspect-[4/3] overflow-hidden rounded-xl border border-soil-700 bg-soil-800">
                        {settings.hero_video ? (
                            /* Vidéo d'en-tête : prioritaire si définie */
                            <video
                                src={settings.hero_video}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="h-full w-full object-cover"
                            />
                        ) : settings.hero_image ? (
                            /* Image d'en-tête */
                            <img src={settings.hero_image} alt="Ferme avicole" className="h-full w-full object-cover" />
                        ) : (
                            /* Placeholder */
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-sand-500">
                                <span className="text-3xl">🐔</span>
                                <span className="text-sm">Ajoutez une image ou vidéo depuis l'admin</span>
                            </div>
                        )}
                    </div>
                </Container>
            </section>

            {/* Stats */}
            <section className="py-10">
                <Container className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard value={settings.stat_years} label="Années d’expérience" />
                    <StatCard value={settings.stat_races} label="Races proposées" />
                    <StatCard value={settings.stat_capacity} label="Capacité de production" />
                    <StatCard value={settings.stat_clients} label="Clients servis" />
                </Container>
            </section>

            <EggDivider />

            {/* Activities */}
            <section className="py-16 sm:py-20">
                <Container>
                    <SectionTitle
                        eyebrow="Ce que nous faisons"
                        title="Nos activités"
                        subtitle="De l’élevage à la vente, en passant par le dépistage sanitaire, chaque étape est suivie avec rigueur."
                    />
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {activities.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity} />
                        ))}
                    </div>
                    <Link href={route('activities')} className="mt-8 inline-block text-sm text-yolk-400 hover:underline">
                        Voir le détail de nos activités →
                    </Link>
                </Container>
            </section>

            {/* Featured poultry */}
            {featuredPoultry.length > 0 && (
                <section className="border-t border-soil-800 py-16 sm:py-20">
                    <Container>
                        <SectionTitle
                            eyebrow="Catalogue"
                            title="Races disponibles"
                            subtitle="Un aperçu de nos poussins et volailles actuellement disponibles."
                        />
                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredPoultry.map((p) => (
                                <PoultryCard key={p.id} poultryType={p} />
                            ))}
                        </div>
                        <Link href={route('poultry.index')} className="mt-8 inline-block text-sm text-yolk-400 hover:underline">
                            Voir tout le catalogue →
                        </Link>
                    </Container>
                </section>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
                <section className="border-t border-soil-800 py-16 sm:py-20">
                    <Container>
                        <SectionTitle eyebrow="Ils nous font confiance" title="Avis de nos clients" align="center" />
                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((t) => (
                                <TestimonialCard key={t.id} testimonial={t} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* News */}
            {news.length > 0 && (
                <section className="border-t border-soil-800 py-16 sm:py-20">
                    <Container>
                        <SectionTitle eyebrow="À la une" title="Dernières actualités" />
                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            {news.map((article) => (
                                <Link
                                    key={article.id}
                                    href={route('news.show', article.slug)}
                                    className="group overflow-hidden rounded-xl border border-soil-700 bg-soil-900/60"
                                >
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
                        </div>
                    </Container>
                </section>
            )}

            {/* CTA */}
            <section className="border-t border-soil-800 py-16 sm:py-20">
                <Container className="rounded-2xl border border-yolk-600/30 bg-gradient-to-br from-soil-900 to-soil-800 p-8 text-center sm:p-12">
                    <h2 className="font-display text-2xl font-semibold text-sand-100 sm:text-3xl">
                        Prêt à passer commande ?
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sand-400">
                        Contactez-nous pour connaître les disponibilités et organiser votre livraison.
                    </p>
                    <Link href={route('contact')} className="mt-6 inline-block rounded-lg bg-yolk-500 px-6 py-3 text-sm font-medium text-soil-950 hover:bg-yolk-400">
                        Contacter la ferme
                    </Link>
                </Container>
            </section>
        </PublicLayout>
    );
}
