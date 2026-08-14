import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/Container';
import SectionTitle from '@/Components/SectionTitle';
import Icon from '@/Components/Icon';
import { Button, Error, Label, TextInput, Textarea } from '@/Components/Form/Field';

export default function Contact({ settings }) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '', email: '', phone: '', subject: '', message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };

    return (
        <PublicLayout>
            <Head title="Contact" />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Parlons-en" title="Contactez-nous" subtitle="Une question, une commande, une visite ? Écrivez-nous." />

                <div className="mt-10 grid gap-10 lg:grid-cols-5">
                    <div className="space-y-4 lg:col-span-2">
                        {settings.contact_phone && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                <Icon name="phone" className="mt-0.5 h-5 w-5 text-yolk-500" />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">Téléphone</p>
                                    <p className="text-sm text-gray-900 dark:text-sand-100">{settings.contact_phone}</p>
                                </div>
                            </div>
                        )}
                        {settings.contact_email && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                <Icon name="mail" className="mt-0.5 h-5 w-5 text-yolk-500" />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">E-mail</p>
                                    <p className="text-sm text-gray-900 dark:text-sand-100">{settings.contact_email}</p>
                                </div>
                            </div>
                        )}
                        {settings.contact_address && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                <Icon name="pin" className="mt-0.5 h-5 w-5 text-yolk-500" />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">Adresse</p>
                                    <p className="whitespace-pre-line text-sm text-gray-900 dark:text-sand-100">{settings.contact_address}</p>
                                </div>
                            </div>
                        )}
                        {settings.contact_hours && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                <Icon name="clock" className="mt-0.5 h-5 w-5 text-yolk-500" />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">Horaires</p>
                                    <p className="whitespace-pre-line text-sm text-gray-900 dark:text-sand-100">{settings.contact_hours}</p>
                                </div>
                            </div>
                        )}
                        {settings.map_embed_url && (
                            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700">
                                <iframe src={settings.map_embed_url} className="h-56 w-full" loading="lazy" title="Localisation de la ferme" />
                            </div>
                        )}
                    </div>

                    <form onSubmit={submit} className="space-y-4 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 lg:col-span-3 shadow-sm dark:shadow-none">
                        {wasSuccessful && (
                            <p className="rounded-lg border border-pasture-500/40 bg-pasture-500/10 p-3 text-sm text-pasture-500">
                                Merci, votre message a bien été envoyé.
                            </p>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="name">Nom complet</Label>
                                <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <Error>{errors.name}</Error>
                            </div>
                            <div>
                                <Label htmlFor="email">E-mail</Label>
                                <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                <Error>{errors.email}</Error>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                                <TextInput id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="subject">Sujet</Label>
                                <TextInput id="subject" value={data.subject} onChange={(e) => setData('subject', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" rows={5} value={data.message} onChange={(e) => setData('message', e.target.value)} />
                            <Error>{errors.message}</Error>
                        </div>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">Envoyer le message</Button>
                    </form>
                </div>
            </Container>
        </PublicLayout>
    );
}
