import { useEffect, useState } from 'react';

/**
 * Hook pour gérer le mode dark/light.
 * Le choix est persisté dans localStorage.
 * Par défaut : mode sombre (le thème original du site).
 */
export function useDarkMode() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        // Respecte la préférence système, sinon sombre par défaut
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return [isDark, setIsDark];
}
