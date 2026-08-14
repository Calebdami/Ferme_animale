import { Link, router, usePage } from '@inertiajs/react';
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

const routeToSlugMap = {
    'about': 'a-propos',
    'poultry.index': 'races-poussins',
    'activities': 'nos-activites',
    'facilities': 'nos-locaux',
    'quality': 'qualite-biosecurite',
    'faq': 'faq',
};

export default function PublicLayout({ children }) {
    const [open, setOpen] = useState(false);
    const { siteName, publishedPages = [] } = usePage().props;
    const currentRoute = route().current();

    const handleAdminDoubleClick = () => {
        router.visit(route('login'));
    };

    // Filtrer les éléments de navigation : ne garder que les pages publiées
    const visibleNavItems = navItems.filter((item) => {
        const slug = routeToSlugMap[item.route];
        if (!slug) return true; // Les pages statiques (Accueil, Galerie, Actualités, Contact) restent visibles
        return publishedPages.includes(slug);
    });

    return (
        <div className="min-h-screen bg-white dark:bg-soil-950 transition-colors duration-200">
            <FlashMessage />

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-soil-800/80 bg-white/95 dark:bg-soil-950/90 backdrop-blur transition-colors duration-200">
                <Container className="flex h-16 items-center justify-between">
                    <Link href={route('home')} className="flex items-center gap-2 font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                        <Icon name="egg" className="h-6 w-6 text-yolk-500" />
                        {siteName}
                    </Link>

                    <nav className="hidden items-center gap-6 lg:flex">
                        {visibleNavItems.map((item) => (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`text-sm transition hover:text-yolk-500 ${
                                    currentRoute === item.route
                                        ? 'text-yolk-500'
                                        : 'text-gray-600 dark:text-sand-300'
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
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-soil-700 text-gray-700 dark:text-sand-100 lg:hidden"
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
                    <nav className="border-t border-gray-100 dark:border-soil-800 bg-white dark:bg-soil-950 lg:hidden">
                        <Container className="flex flex-col py-2">
                            {visibleNavItems.map((item) => (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    onClick={() => setOpen(false)}
                                    className={`border-b border-gray-100 dark:border-soil-800/60 py-3 text-sm last:border-0 ${
                                        currentRoute === item.route ? 'text-yolk-500' : 'text-gray-700 dark:text-sand-300'
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

            {/* Footer */}
            <footer className="mt-24 border-t border-gray-200 dark:border-soil-800 bg-gray-50 dark:bg-soil-900/40 transition-colors duration-200">
                <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                            <Icon name="egg" className="h-5 w-5 text-yolk-500" />
                            {siteName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-sand-500">
                            Élevage spécialisé de poussins et volailles : sélection, dépistage sanitaire et accompagnement des éleveurs.
                        </p>
                    </div>
                    <div>
                        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-gray-400 dark:text-sand-500">Navigation</p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-sand-300">
                            {visibleNavItems.slice(0, Math.ceil(visibleNavItems.length / 2)).map((item) => (
                                <li key={item.route}>
                                    <Link href={route(item.route)} className="hover:text-yolk-500">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-gray-400 dark:text-sand-500">Ressources</p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-sand-300">
                            {visibleNavItems.slice(Math.ceil(visibleNavItems.length / 2)).map((item) => (
                                <li key={item.route}>
                                    <Link href={route(item.route)} className="hover:text-yolk-500">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Container>
                <Container className="flex items-center justify-between border-t border-gray-200 dark:border-soil-800 py-6 text-xs text-gray-400 dark:text-sand-500">
                    <span>© {new Date().getFullYear()} {siteName}. Tous droits réservés.</span>
                    <button
                        onDoubleClick={handleAdminDoubleClick}
                        title=""
                        aria-label="Accès discret"
                        className="p-1 text-gray-300 dark:text-soil-700 opacity-30 hover:opacity-50 transition-opacity cursor-default select-none focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                        </svg>
                    </button>
                </Container>
            </footer>
        </div>
    );
}
