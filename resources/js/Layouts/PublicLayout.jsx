import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FlashMessage from '@/Components/FlashMessage';
import Container from '@/Components/Container';
import Icon from '@/Components/Icon';
import ThemeToggle from '@/Components/ThemeToggle';

const navItems = [
    { label: 'Accueil', route: 'home' },
    { label: 'Qui sommes-nous', route: 'about' },
    { label: 'Races & poussins', route: 'poultry.index' },
    { label: 'Nos activités', route: 'activities' },
    { label: 'Nos locaux', route: 'facilities' },
    { label: 'Qualité & biosécurité', route: 'quality' },
    { label: 'Galerie', route: 'gallery' },
    { label: 'Actualités', route: 'news.index' },
    { label: 'FAQ', route: 'faq' },
    { label: 'Contact', route: 'contact' },
];

export default function PublicLayout({ children }) {
    const [open, setOpen] = useState(false);
    const { siteName, url } = usePage().props;
    const currentRoute = route().current();

    return (
        <div className="min-h-screen bg-soil-950 dark:bg-soil-950 bg-amber-50">
            <FlashMessage />

            <header className="sticky top-0 z-40 border-b border-soil-800/80 bg-soil-950/90 dark:bg-soil-950/90 light-header backdrop-blur">
                <Container className="flex h-16 items-center justify-between">
                    <Link href={route('home')} className="flex items-center gap-2 font-display text-lg font-semibold text-sand-100">
                        <Icon name="egg" className="h-6 w-6 text-yolk-500" />
                        {siteName}
                    </Link>

                    <nav className="hidden items-center gap-6 lg:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`text-sm transition hover:text-yolk-400 ${
                                    currentRoute === item.route ? 'text-yolk-400' : 'text-sand-300'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setOpen(!open)}
                            aria-label="Ouvrir le menu"
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-soil-700 text-sand-100 dark:text-sand-100 light-text lg:hidden"
                        >
                            <div className="flex flex-col gap-1.5">
                                <span className={`h-0.5 w-5 bg-current transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
                                <span className={`h-0.5 w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
                                <span className={`h-0.5 w-5 bg-current transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
                            </div>
                        </button>
                    </div>
                </Container>

                {open && (
                    <nav className="border-t border-soil-800 bg-soil-950 lg:hidden">
                        <Container className="flex flex-col py-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    onClick={() => setOpen(false)}
                                    className={`border-b border-soil-800/60 py-3 text-sm last:border-0 ${
                                        currentRoute === item.route ? 'text-yolk-400' : 'text-sand-300'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Container>
                    </nav>
                )}
            </header>

            <main>{children}</main>

            <footer className="mt-24 border-t border-soil-800 bg-soil-900/40">
                <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-sand-100">
                            <Icon name="egg" className="h-5 w-5 text-yolk-500" />
                            {siteName}
                        </p>
                        <p className="text-sm text-sand-500">
                            Élevage spécialisé de poussins et volailles : sélection, dépistage sanitaire et accompagnement des éleveurs.
                        </p>
                    </div>
                    <div>
                        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-sand-500">Navigation</p>
                        <ul className="space-y-2 text-sm text-sand-300">
                            {navItems.slice(0, 5).map((item) => (
                                <li key={item.route}>
                                    <Link href={route(item.route)} className="hover:text-yolk-400">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-sand-500">Ressources</p>
                        <ul className="space-y-2 text-sm text-sand-300">
                            {navItems.slice(5).map((item) => (
                                <li key={item.route}>
                                    <Link href={route(item.route)} className="hover:text-yolk-400">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-sand-500">Espace pro</p>
                        <Link href={route('login')} className="text-sm text-sand-300 hover:text-yolk-400">
                            Connexion administrateur
                        </Link>
                    </div>
                </Container>
                <Container className="border-t border-soil-800 py-6 text-xs text-sand-500">
                    © {new Date().getFullYear()} {siteName}. Tous droits réservés.
                </Container>
            </footer>
        </div>
    );
}
