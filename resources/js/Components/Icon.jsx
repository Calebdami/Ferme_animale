// Minimal inline-icon set, keyed by keyword, no external icon dependency.
const paths = {
    feather: 'M20 4 4 20m16-16-9 3-4 4-3 9 9-3 4-4 3-9Z',
    'shopping-bag': 'M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2',
    'shield-check': 'M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Zm-3 9 2 2 4-4',
    syringe: 'M18 3l3 3-2 2-3-3 2-2Zm-2 4L6 17l-2 4 4-2L18 9l-2-2Z',
    chat: 'M4 5h16v11H8l-4 4V5Z',
    egg: 'M12 3C8 3 5 9 5 14a7 7 0 0 0 14 0c0-5-3-11-7-11Z',
    leaf: 'M4 20c8 0 16-8 16-16-8 0-16 8-16 16Zm0 0c2-4 4-8 8-11',
    phone: 'M5 4h4l2 5-2.5 2A11 11 0 0 0 14 16.5L16 14l5 2v4a2 2 0 0 1-2 2C10 22 2 14 2 6a2 2 0 0 1 2-2Z',
    mail: 'M4 5h16v14H4V5Zm0 0 8 7 8-7',
    pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    check: 'M5 13l4 4L19 7',
};

export default function Icon({ name = 'egg', className = 'h-6 w-6' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
             strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d={paths[name] || paths.egg} />
        </svg>
    );
}
