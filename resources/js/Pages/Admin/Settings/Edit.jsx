import { Head, useForm } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Textarea } from '@/Components/Form/Field';

const groupLabels = {
    general: 'Général',
    hero: "Bannière d'accueil",
    stats: 'Chiffres clés',
    about: 'À propos',
    contact: 'Coordonnées',
    social: 'Réseaux sociaux',
};

function getMediaUrl(savedPath) {
    if (!savedPath) return null;
    if (savedPath.startsWith('http://') || savedPath.startsWith('https://') || savedPath.startsWith('/')) {
        return savedPath;
    }
    return `/storage/${savedPath}`;
}

/**
 * Prévisualisation d'un fichier sélectionné localement ou déjà sauvegardé en BDD.
 */
function MediaPreview({ localUrl, savedPath, type }) {
    const src = localUrl || getMediaUrl(savedPath);

    if (!src) return null;

    return (
        <div className="relative mb-2 overflow-hidden rounded-lg border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800">
            {type === 'image' ? (
                <img
                    src={src}
                    alt="Aperçu"
                    className="h-44 w-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            ) : (
                <video
                    src={src}
                    controls
                    className="h-44 w-full object-cover"
                    key={src}
                />
            )}
            {localUrl && (
                <span className="absolute right-2 top-2 rounded-full bg-yolk-500 px-2 py-0.5 text-[10px] font-semibold text-soil-950">
                    Non enregistré
                </span>
            )}
        </div>
    );
}

export default function Edit({ settings }) {
    const grouped = settings.reduce((acc, s) => {
        (acc[s.group] ||= []).push(s);
        return acc;
    }, {});

    const { data, setData, post, processing } = useForm({
        _method: 'put',
        settings: settings.map((s) => ({ id: s.id, value: s.value })),
        files: {},
    });

    const [localPreviews, setLocalPreviews] = useState({});

    const setValue = (id, value) => {
        setData('settings', data.settings.map((s) => (s.id === id ? { ...s, value } : s)));
    };

    const setFile = useCallback((id, file) => {
        if (!file) return;

        if (localPreviews[id]) {
            URL.revokeObjectURL(localPreviews[id]);
        }

        const blobUrl = URL.createObjectURL(file);
        setLocalPreviews((prev) => ({ ...prev, [id]: blobUrl }));
        setData('files', { ...data.files, [id]: file });
    }, [data.files, localPreviews]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            forceFormData: true,
            onSuccess: () => {
                Object.values(localPreviews).forEach(URL.revokeObjectURL);
                setLocalPreviews({});
            },
        });
    };

    return (
        <AdminLayout title="Réglages du site">
            <Head title="Réglages" />

            <form onSubmit={submit} className="space-y-10">
                {Object.entries(grouped).map(([group, items]) => (
                    <fieldset key={group} className="rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-5 shadow-sm dark:shadow-none">
                        <legend className="px-1 font-display text-base font-semibold text-gray-900 dark:text-sand-100">
                            {groupLabels[group] || group}
                        </legend>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {items.map((s) => {
                                const current = data.settings.find((d) => d.id === s.id)?.value ?? '';
                                return (
                                    <div key={s.id} className={s.type === 'textarea' ? 'sm:col-span-2' : ''}>
                                        <Label htmlFor={`s-${s.id}`}>{s.label || s.key}</Label>

                                        {s.type === 'textarea' && (
                                            <Textarea
                                                id={`s-${s.id}`}
                                                rows={3}
                                                value={current || ''}
                                                onChange={(e) => setValue(s.id, e.target.value)}
                                            />
                                        )}

                                        {s.type === 'text' && (
                                            <TextInput
                                                id={`s-${s.id}`}
                                                value={current || ''}
                                                onChange={(e) => setValue(s.id, e.target.value)}
                                            />
                                        )}

                                        {(s.type === 'image' || s.type === 'video') && (
                                            <div className="space-y-2">
                                                <MediaPreview
                                                    localUrl={localPreviews[s.id] || null}
                                                    savedPath={s.value}
                                                    type={s.type}
                                                />

                                                <label
                                                    htmlFor={`s-${s.id}`}
                                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-soil-600 bg-gray-50 dark:bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-gray-100 dark:hover:bg-soil-800"
                                                >
                                                    <span className="text-xs text-yolk-500">
                                                        {s.type === 'image' ? '📷' : '🎬'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-sand-400">
                                                        {localPreviews[s.id]
                                                            ? 'Changer le fichier sélectionné'
                                                            : s.value
                                                                ? 'Remplacer le fichier actuel'
                                                                : `Choisir ${s.type === 'image' ? 'une image' : 'une vidéo'}`}
                                                    </span>
                                                    <input
                                                        id={`s-${s.id}`}
                                                        type="file"
                                                        accept={s.type === 'image' ? 'image/*' : 'video/*'}
                                                        onChange={(e) => setFile(s.id, e.target.files[0])}
                                                        className="sr-only"
                                                    />
                                                </label>

                                                {s.value && !localPreviews[s.id] && (
                                                    <p className="text-[11px] text-gray-400 dark:text-sand-500">
                                                        Fichier actuel : <span className="font-mono">{s.value.split('/').pop()}</span>
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </fieldset>
                ))}

                <Button type="submit" disabled={processing}>
                    {processing ? 'Enregistrement…' : 'Enregistrer les réglages'}
                </Button>
            </form>
        </AdminLayout>
    );
}
