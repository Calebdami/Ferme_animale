import { Head, useForm } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button, Label, TextInput, Textarea } from '@/Components/Form/Field';
import FocalPointPicker from '@/Components/FocalPointPicker';

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

export default function Edit({ settings }) {
    const grouped = settings.reduce((acc, s) => {
        if (['hero_focal_x', 'hero_focal_y', 'hero_zoom'].includes(s.key)) {
            return acc; // géré de manière spécifique via FocalPointPicker
        }
        (acc[s.group] ||= []).push(s);
        return acc;
    }, {});

    const getSettingVal = (key, defaultVal) => {
        const found = settings.find((s) => s.key === key);
        return found ? found.value : defaultVal;
    };

    const { data, setData, post, processing } = useForm({
        _method: 'put',
        settings: settings.map((s) => ({ id: s.id, value: s.value })),
        files: {},
        remove_settings: [],
    });

    const [localPreviews, setLocalPreviews] = useState({});

    const setValue = (id, value) => {
        setData('settings', data.settings.map((s) => (s.id === id ? { ...s, value } : s)));
    };

    const setValueByKey = (key, value) => {
        const setting = settings.find((s) => s.key === key);
        if (setting) {
            setValue(setting.id, String(value));
        }
    };

    const getValueByKey = (key, defaultVal) => {
        const setting = settings.find((s) => s.key === key);
        if (!setting) return defaultVal;
        const current = data.settings.find((d) => d.id === setting.id);
        return current ? current.value : defaultVal;
    };

    const setFile = useCallback((id, file) => {
        if (!file) return;

        if (localPreviews[id]) {
            URL.revokeObjectURL(localPreviews[id]);
        }

        const blobUrl = URL.createObjectURL(file);
        setLocalPreviews((prev) => ({ ...prev, [id]: blobUrl }));
        setData((prev) => ({
            ...prev,
            files: { ...prev.files, [id]: file },
            remove_settings: prev.remove_settings.filter((rid) => rid !== id),
        }));
    }, [localPreviews]);

    const handleRemoveMedia = (settingId) => {
        if (localPreviews[settingId]) {
            URL.revokeObjectURL(localPreviews[settingId]);
            setLocalPreviews((prev) => {
                const updated = { ...prev };
                delete updated[settingId];
                return updated;
            });
        }

        setData((prev) => {
            const updatedFiles = { ...prev.files };
            delete updatedFiles[settingId];
            return {
                ...prev,
                files: updatedFiles,
                remove_settings: [...new Set([...prev.remove_settings, settingId])],
                settings: prev.settings.map((s) => (s.id === settingId ? { ...s, value: '' } : s)),
            };
        });
    };

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

    const heroImageSetting = settings.find((s) => s.key === 'hero_image');
    const heroImageSrc = heroImageSetting
        ? localPreviews[heroImageSetting.id] || (data.remove_settings.includes(heroImageSetting.id) ? null : getMediaUrl(heroImageSetting.value))
        : null;

    return (
        <AdminLayout title="Réglages du site">
            <Head title="Réglages" />

            <form onSubmit={submit} className="space-y-10">
                {Object.entries(grouped).map(([group, items]) => (
                    <fieldset key={group} className="rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-5 shadow-sm dark:shadow-none">
                        <legend className="px-1 font-display text-base font-semibold text-gray-900 dark:text-sand-100">
                            {groupLabels[group] || group}
                        </legend>
                        <div className="mt-4 grid gap-5 sm:grid-cols-2">
                            {items.map((s) => {
                                const current = data.settings.find((d) => d.id === s.id)?.value ?? '';
                                const isRemoved = data.remove_settings.includes(s.id);
                                const mediaUrl = localPreviews[s.id] || (isRemoved ? null : getMediaUrl(s.value));

                                return (
                                    <div key={s.id} className={s.type === 'textarea' || s.key === 'hero_image' ? 'sm:col-span-2' : ''}>
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
                                            <div className="space-y-3">
                                                {/* Cadrage tactile si c'est la photo d'en-tête */}
                                                {s.key === 'hero_image' && mediaUrl ? (
                                                    <FocalPointPicker
                                                        src={mediaUrl}
                                                        focalX={parseFloat(getValueByKey('hero_focal_x', 50))}
                                                        focalY={parseFloat(getValueByKey('hero_focal_y', 50))}
                                                        zoom={parseFloat(getValueByKey('hero_zoom', 1))}
                                                        onChange={({ focalX, focalY, zoom }) => {
                                                            setValueByKey('hero_focal_x', focalX);
                                                            setValueByKey('hero_focal_y', focalY);
                                                            setValueByKey('hero_zoom', zoom);
                                                        }}
                                                        label="Cadrage & Zoom tactile pour la bannière d'accueil"
                                                    />
                                                ) : mediaUrl ? (
                                                    <div className="relative mb-2 overflow-hidden rounded-lg border border-gray-200 dark:border-soil-700 bg-gray-100 dark:bg-soil-800">
                                                        {s.type === 'image' ? (
                                                            <img src={mediaUrl} alt="Aperçu" className="h-44 w-full object-cover" />
                                                        ) : (
                                                            <video src={mediaUrl} controls className="h-44 w-full object-cover" />
                                                        )}
                                                    </div>
                                                ) : null}

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <label
                                                        htmlFor={`s-${s.id}`}
                                                        className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-soil-600 bg-gray-50 dark:bg-soil-800/50 px-4 py-3 transition hover:border-yolk-500 hover:bg-gray-100 dark:hover:bg-soil-800"
                                                    >
                                                        <span className="text-xs text-yolk-500">
                                                            {s.type === 'image' ? '📷' : '🎬'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-sand-400">
                                                            {mediaUrl ? `Changer ${s.type === 'image' ? "l'image" : 'la vidéo'}` : `Choisir ${s.type === 'image' ? 'une image' : 'une vidéo'}`}
                                                        </span>
                                                        <input
                                                            id={`s-${s.id}`}
                                                            type="file"
                                                            accept={s.type === 'image' ? 'image/*' : 'video/*'}
                                                            onChange={(e) => setFile(s.id, e.target.files[0])}
                                                            className="sr-only"
                                                        />
                                                    </label>

                                                    {mediaUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveMedia(s.id)}
                                                            className="rounded-lg border border-clay-500/30 bg-clay-500/10 px-3 py-3 text-xs font-semibold text-clay-500 hover:bg-clay-500/20 transition"
                                                        >
                                                            🗑️ Supprimer {s.type === 'image' ? 'la photo' : 'la vidéo'}
                                                        </button>
                                                    )}
                                                </div>
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
