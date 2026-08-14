import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    useEffect(() => setVisible(true), [flash?.success]);

    if (!flash?.success || !visible) return null;

    return (
        <div className="fixed inset-x-4 top-4 z-50 mx-auto max-w-md rounded-xl border border-pasture-500/40 bg-white dark:bg-soil-900 p-4 shadow-xl sm:inset-x-auto sm:right-4">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-gray-800 dark:text-sand-100">{flash.success}</p>
                <button onClick={() => setVisible(false)} className="text-gray-400 dark:text-sand-500 hover:text-gray-700 dark:hover:text-sand-100">✕</button>
            </div>
        </div>
    );
}
