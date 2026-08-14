import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);
    const timerRef = useRef(null);

    // Chaque nouvelle valeur flash.success déclenche un cycle d'affichage
    useEffect(() => {
        if (!flash?.success) return;

        // Réinitialise si un ancien timer tourne encore
        if (timerRef.current) clearTimeout(timerRef.current);
        setExiting(false);
        setVisible(true);

        // Après 2s : lancer l'animation de sortie
        timerRef.current = setTimeout(() => {
            setExiting(true);
            // Après 400ms (durée anim) : masquer complètement
            setTimeout(() => setVisible(false), 400);
        }, 2000);

        return () => clearTimeout(timerRef.current);
    }, [flash?.success]);

    const dismiss = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setExiting(true);
        setTimeout(() => setVisible(false), 400);
    };

    if (!flash?.success || !visible) return null;

    return (
        <div
            className={`fixed inset-x-4 top-4 z-50 mx-auto max-w-md transition-all duration-400 sm:inset-x-auto sm:right-4 ${
                exiting
                    ? 'opacity-0 translate-y-[-8px] pointer-events-none'
                    : 'opacity-100 translate-y-0'
            }`}
            style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
        >
            <div className="flex items-start justify-between gap-3 rounded-xl border border-pasture-500/40 bg-white dark:bg-soil-900 p-4 shadow-xl">
                <div className="flex items-center gap-2">
                    <span className="text-pasture-500 text-base">✓</span>
                    <p className="text-sm text-gray-800 dark:text-sand-100">{flash.success}</p>
                </div>
                <button
                    onClick={dismiss}
                    className="shrink-0 text-gray-400 dark:text-sand-500 hover:text-gray-700 dark:hover:text-sand-100 transition-colors"
                    aria-label="Fermer"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
