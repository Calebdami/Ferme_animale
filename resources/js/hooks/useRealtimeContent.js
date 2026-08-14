import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

/**
 * Hook qui écoute les mises à jour temps réel via Laravel Echo/Reverb.
 * Dès qu'un admin modifie un contenu, la page vitrine se rafraîchit
 * automatiquement sans rechargement visible.
 *
 * @param {string|string[]} sections  Section(s) à écouter, ex: 'activities' ou ['activities','settings']
 * @param {object} options
 * @param {number} options.debounceMs   Délai de debounce avant le reload (défaut: 500ms)
 * @param {function} options.onUpdate   Callback optionnel appelé avant le reload
 */
export function useRealtimeContent(sections, { debounceMs = 500, onUpdate } = {}) {
    const timerRef = useRef(null);
    const sectionsArray = Array.isArray(sections) ? sections : [sections];

    useEffect(() => {
        // Si Echo n'est pas disponible (Reverb non démarré), on ignore silencieusement
        if (!window.Echo) return;

        const channel = window.Echo.channel('site-content');

        const handler = (event) => {
            if (sectionsArray.includes('*') || sectionsArray.includes(event.section)) {
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    onUpdate?.(event);
                    router.reload({ only: [] }); // Recharge les props Inertia sans full-page reload
                }, debounceMs);
            }
        };

        channel.listen('.content.updated', handler);

        return () => {
            channel.stopListening('.content.updated', handler);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [JSON.stringify(sectionsArray), debounceMs]);
}
