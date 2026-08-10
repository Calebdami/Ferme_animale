import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Error, Label, TextInput } from '@/Components/Form/Field';
import Icon from '@/Components/Icon';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-soil-950 px-5">
            <Head title="Connexion administrateur" />
            <div className="w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center text-center">
                    <Icon name="egg" className="mb-3 h-9 w-9 text-yolk-500" />
                    <h1 className="font-display text-2xl font-semibold text-sand-100">Espace administrateur</h1>
                    <p className="mt-1 text-sm text-sand-500">Connectez-vous pour gérer le contenu du site.</p>
                </div>

                <form onSubmit={submit} className="space-y-4 rounded-xl border border-soil-700 bg-soil-900/60 p-6">
                    <div>
                        <Label htmlFor="email">Adresse e-mail</Label>
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <Error>{errors.email}</Error>
                    </div>

                    <div>
                        <Label htmlFor="password">Mot de passe</Label>
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <Error>{errors.password}</Error>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-sand-500">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-soil-700 bg-soil-900 text-yolk-500 focus:ring-yolk-500"
                        />
                        Se souvenir de moi
                    </label>

                    <Button type="submit" disabled={processing} className="w-full">
                        Se connecter
                    </Button>
                </form>

                <Link href={route('home')} className="mt-6 block text-center text-sm text-sand-500 hover:text-yolk-400">
                    ← Retour au site
                </Link>
            </div>
        </div>
    );
}
