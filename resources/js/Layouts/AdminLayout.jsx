import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FlashMessage from '@/Components/FlashMessage';
import Icon from '@/Components/Icon';
import ThemeToggle from '@/Components/ThemeToggle';

const links = [
    { label: 'Tableau de bord', route: 'admin.dashboard' },
    { label: 'Réglages du site', route: 'admin.settings.edit' },
    { label: 'Pages', route: 'admin.pages.index' },
    { label: 'Types de volailles', route: 'admin.poultry-types.index' },
    { label: 'Activités', route: 'admin.activities.index' },
    { label: 'Médias (photos/vidéos)', route: 'admin.media.index' },
    { label: 'Témoignages', route: 'admin.testimonials.index' },
    { label: 'Actualités', route: 'admin.news.index' },
    { label: 'Messages reçus', route: 'admin.messages.index' },
];

export default function AdminLayout({ children, title }) {
    const [open, setOpen] = useState(false);
    const { auth, siteName } = usePage().props;
    const current = route().current();

    const logout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const Nav = () => (
        <nav className="space-y-1">
            {links.map((item) => (
                <Link
                    key={item.route}
                    href={route(item.route)}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                        current === item.route || current?.startsWith(item.route.split('.')[0] + '.' + item.route.split('.')[1])
                            ? 'bg-yolk-500/10 text-yolk-400'
                            : 'text-sand-300 hover:bg-soil-800'
                    }`}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    return (
        <div className="min-h-screen bg-soil-950 lg:flex">
            <FlashMessage />

            {/* Sidebar - desktop */}
            <aside className="hidden w-64 shrink-0 border-r border-soil-800 bg-soil-900/40 p-5 lg:block">
                <p className="mb-6 flex items-center gap-2 font-display text-lg font-semibold text-sand-100">
                    <Icon name="egg" className="h-5 w-5 text-yolk-500" /> {siteName}
                </p>
                <Nav />
                <div className="mt-8 border-t border-soil-800 pt-4">
                    <p className="mb-2 truncate text-xs text-sand-500">{auth?.user?.email}</p>
                    <div className="flex items-center justify-between">
                        <button onClick={logout} className="text-sm text-clay-500 hover:underline">Se déconnecter</button>
                        <ThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Topbar - mobile */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-soil-800 bg-soil-950/95 p-4 backdrop-blur lg:hidden">
                <p className="flex items-center gap-2 font-display text-base font-semibold text-sand-100">
                    <Icon name="egg" className="h-5 w-5 text-yolk-500" /> Admin
                </p>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-soil-700 text-sand-100">
                        {open ? '✕' : '☰'}
                    </button>
                </div>
            </header>

            {open && (
                <div className="border-b border-soil-800 bg-soil-900 p-4 lg:hidden">
                    <Nav />
                    <div className="mt-4 border-t border-soil-800 pt-4">
                        <p className="mb-2 truncate text-xs text-sand-500">{auth?.user?.email}</p>
                        <button onClick={logout} className="text-sm text-clay-500 hover:underline">Se déconnecter</button>
                    </div>
                </div>
            )}

            <main className="flex-1 p-4 sm:p-6 lg:p-10">
                {title && <h1 className="mb-6 font-display text-2xl font-semibold text-sand-100">{title}</h1>}
                {children}
            </main>
        </div>
    );
}
