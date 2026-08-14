import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Error, Label, TextInput, Toggle } from '@/Components/Form/Field';

export default function Edit({ user }) {
    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const twoFactorForm = useForm({});

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.put(route('admin.profile.update'));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('admin.profile.password'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleToggle2FA = (e) => {
        e.preventDefault();
        twoFactorForm.patch(route('admin.profile.2fa'));
    };

    return (
        <AdminLayout title="Mon profil & Sécurité">
            <Head title="Profil & Sécurité" />

            <div className="max-w-2xl space-y-8">
                {/* 1. Informations du profil */}
                <form onSubmit={submitProfile} className="space-y-4 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 shadow-sm dark:shadow-none">
                    <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                        Informations du compte
                    </h2>

                    <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <TextInput
                            id="name"
                            value={profileForm.data.name}
                            onChange={(e) => profileForm.setData('name', e.target.value)}
                        />
                        <Error>{profileForm.errors.name}</Error>
                    </div>

                    <div>
                        <Label htmlFor="email">Adresse e-mail</Label>
                        <TextInput
                            id="email"
                            type="email"
                            value={profileForm.data.email}
                            onChange={(e) => profileForm.setData('email', e.target.value)}
                        />
                        <Error>{profileForm.errors.email}</Error>
                    </div>

                    <Button type="submit" disabled={profileForm.processing}>
                        {profileForm.processing ? 'Enregistrement…' : 'Mettre à jour mes informations'}
                    </Button>
                </form>

                {/* 2. Modification du mot de passe */}
                <form onSubmit={submitPassword} className="space-y-4 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 shadow-sm dark:shadow-none">
                    <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                        Changer le mot de passe
                    </h2>

                    <div>
                        <Label htmlFor="current_password">Mot de passe actuel</Label>
                        <TextInput
                            id="current_password"
                            type="password"
                            value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                        />
                        <Error>{passwordForm.errors.current_password}</Error>
                    </div>

                    <div>
                        <Label htmlFor="new_password">Nouveau mot de passe</Label>
                        <TextInput
                            id="new_password"
                            type="password"
                            value={passwordForm.data.password}
                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                        />
                        <Error>{passwordForm.errors.password}</Error>
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation">Confirmer le nouveau mot de passe</Label>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            value={passwordForm.data.password_confirmation}
                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        />
                        <Error>{passwordForm.errors.password_confirmation}</Error>
                    </div>

                    <Button type="submit" disabled={passwordForm.processing}>
                        {passwordForm.processing ? 'Mise à jour…' : 'Modifier le mot de passe'}
                    </Button>
                </form>

                {/* 3. Sécurité (Double Authentification 2FA) */}
                <div className="space-y-4 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 shadow-sm dark:shadow-none">
                    <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-sand-100">
                        Sécurité (Double Authentification / 2FA)
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-sand-400 leading-relaxed">
                        Lorsque la double authentification est activée, un code à 6 chiffres est envoyé sur votre adresse e-mail lors de chaque connexion.
                    </p>

                    <div className="flex items-center justify-between pt-2">
                        <Toggle
                            checked={user.two_factor_enabled}
                            onChange={handleToggle2FA}
                            label={user.two_factor_enabled ? '2FA activée par e-mail' : '2FA désactivée'}
                        />
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.two_factor_enabled
                                ? 'bg-pasture-500/15 text-pasture-500'
                                : 'bg-clay-500/15 text-clay-500'
                        }`}>
                            {user.two_factor_enabled ? 'Protégé' : 'Non protégé'}
                        </span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
