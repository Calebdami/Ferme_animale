import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Error, Label, TextInput, Toggle } from '@/Components/Form/Field';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Index({ users }) {
    const { auth } = usePage().props;
    const [deletingUser, setDeletingUser] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        two_factor_enabled: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleToggleActive = (user) => {
        router.patch(route('admin.users.toggle-active', user.id));
    };

    const handleConfirmDelete = () => {
        if (deletingUser) {
            router.delete(route('admin.users.destroy', deletingUser.id));
        }
    };

    return (
        <AdminLayout title="Gestion des administrateurs">
            <Head title="Administrateurs" />

            <div className="space-y-10">
                {/* Formulaire de création d'un administrateur */}
                <div className="rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 shadow-sm dark:shadow-none">
                    <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                        Ajouter un nouvel administrateur
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-sand-400">
                        Le nouvel administrateur aura les mêmes droits d'accès à l'espace d'administration.
                    </p>

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="name">Nom complet</Label>
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ex: Jean Dupont"
                                />
                                <Error>{errors.name}</Error>
                            </div>
                            <div>
                                <Label htmlFor="email">Adresse e-mail (Identifiant de connexion)</Label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@ferme.com"
                                />
                                <Error>{errors.email}</Error>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">Mot de passe initial</Label>
                            <TextInput
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            <p className="mt-1 text-xs text-gray-400 dark:text-sand-500">
                                L'administrateur pourra modifier son mot de passe plus tard depuis son profil.
                            </p>
                            <Error>{errors.password}</Error>
                        </div>

                        <Toggle
                            checked={data.two_factor_enabled}
                            onChange={(e) => setData('two_factor_enabled', e.target.checked)}
                            label="Activer la double authentification (2FA par e-mail) par défaut"
                        />

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Création en cours…' : 'Créer l’administrateur'}
                        </Button>
                    </form>
                </div>

                {/* Liste des administrateurs */}
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 shadow-sm dark:shadow-none">
                    <div className="border-b border-gray-200 dark:border-soil-800 p-4 font-display text-base font-semibold text-gray-900 dark:text-sand-100">
                        Liste des comptes administrateurs ({users.length})
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-soil-800">
                        {users.map((u) => {
                            const isSelf = u.id === auth?.user?.id;
                            return (
                                <div key={u.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-sand-100">{u.name}</p>
                                            {isSelf && (
                                                <span className="rounded-full bg-yolk-500/15 px-2 py-0.5 text-[10px] font-semibold text-yolk-600 dark:text-yolk-400">
                                                    Vous
                                                </span>
                                            )}
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                u.is_active
                                                    ? 'bg-pasture-500/15 text-pasture-500'
                                                    : 'bg-clay-500/15 text-clay-500'
                                            }`}>
                                                {u.is_active ? 'Actif' : 'Désactivé'}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-sand-400">{u.email}</p>
                                        <div className="mt-1 flex gap-3 text-[11px] text-gray-400 dark:text-sand-500">
                                            <span>2FA : {u.two_factor_enabled ? 'Activée' : 'Désactivée'}</span>
                                        </div>
                                    </div>

                                    {!isSelf && (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleToggleActive(u)}
                                                className={`text-xs font-medium hover:underline ${
                                                    u.is_active ? 'text-amber-600 dark:text-yolk-400' : 'text-pasture-500'
                                                }`}
                                            >
                                                {u.is_active ? 'Désactiver' : 'Activer'}
                                            </button>
                                            <button
                                                onClick={() => setDeletingUser(u)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-clay-500 transition hover:border-clay-300 hover:bg-clay-50 dark:border-soil-700 dark:bg-soil-800 dark:text-clay-400 dark:hover:bg-soil-700"
                                                aria-label={`Supprimer ${u.name}`}
                                                title="Supprimer"
                                            >
                                                <Icon name="trash" className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer cet administrateur"
                message={`Êtes-vous sûr de vouloir supprimer le compte de « ${deletingUser?.name} » (${deletingUser?.email}) ? Il n'aura plus aucun accès.`}
                confirmText="Supprimer"
            />
        </AdminLayout>
    );
}
