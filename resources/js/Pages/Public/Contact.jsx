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

    // Construire le lien WhatsApp avec le message pré-rempli
    const buildWhatsAppLink = () => {
        const number = (settings.contact_whatsapp || '').replace(/[\s\+\-().]/g, '');
        if (!number) return null;
        const text = encodeURIComponent(
            `Bonjour, j'ai une question concernant la ferme avicole.`
        );
        return `https://wa.me/${number}?text=${text}`;
    };
    const whatsappLink = buildWhatsAppLink();

    return (
        <PublicLayout>
            <Head title="Contact" />
            <Container className="py-14 sm:py-20">
                <SectionTitle eyebrow="Parlons-en" title="Contactez-nous" subtitle="Une question, une commande, une visite ? Écrivez-nous." />

                <div className="mt-10 grid gap-10 lg:grid-cols-5">
                    <div className="space-y-4 lg:col-span-2">
                        {/* Téléphone */}
                        {settings.contact_phone && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                <Icon name="phone" className="mt-0.5 h-5 w-5 text-yolk-500" />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">Téléphone</p>
                                    <p className="text-sm text-gray-900 dark:text-sand-100">{settings.contact_phone}</p>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp */}
                        {settings.contact_whatsapp && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                {/* Icône WhatsApp SVG */}
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">WhatsApp</p>
                                    {whatsappLink ? (
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                                        >
                                            {settings.contact_whatsapp}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-900 dark:text-sand-100">{settings.contact_whatsapp}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* E-mail */}
                        {settings.contact_email && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                <Icon name="mail" className="mt-0.5 h-5 w-5 text-yolk-500" />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">E-mail</p>
                                    <p className="text-sm text-gray-900 dark:text-sand-100">{settings.contact_email}</p>
                                </div>
                            </div>
                        )}

                        {/* Adresse */}
                        {settings.contact_address && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                <Icon name="pin" className="mt-0.5 h-5 w-5 text-yolk-500" />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">Adresse</p>
                                    <p className="whitespace-pre-line text-sm text-gray-900 dark:text-sand-100">{settings.contact_address}</p>
                                </div>
                            </div>
                        )}

                        {/* Horaires */}
                        {settings.contact_hours && (
                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-4 shadow-sm dark:shadow-none">
                                <Icon name="clock" className="mt-0.5 h-5 w-5 text-yolk-500" />
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-sand-500">Horaires</p>
                                    <p className="whitespace-pre-line text-sm text-gray-900 dark:text-sand-100">{settings.contact_hours}</p>
                                </div>
                            </div>
                        )}

                        {/* Carte — uniquement si l'URL est une URL embed Google Maps valide */}
                        {settings.map_embed_url && settings.map_embed_url.includes('embed') && (
                            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-soil-700">
                                <iframe src={settings.map_embed_url} className="h-56 w-full" loading="lazy" title="Localisation de la ferme" />
                            </div>
                        )}
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={submit} className="space-y-4 rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 lg:col-span-3 shadow-sm dark:shadow-none">
                        {wasSuccessful && (
                            <div className="rounded-lg border border-pasture-500/40 bg-pasture-500/10 p-4 text-sm text-pasture-600 dark:text-pasture-400 flex items-start gap-2">
                                <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.</span>
                            </div>
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
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    value={data.phone}
                                    maxLength={20}
                                    onChange={(e) => {
                                        // N'accepter que les chiffres, +, espaces et tirets
                                        const val = e.target.value.replace(/[^0-9+\s\-]/g, '');
                                        setData('phone', val);
                                    }}
                                    placeholder="Ex : +229 01 23 45 67"
                                />
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

                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Envoi en cours…' : 'Envoyer le message'}
                        </Button>
                    </form>
                </div>
            </Container>
        </PublicLayout>
    );
}
