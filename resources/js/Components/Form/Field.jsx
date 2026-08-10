export function Label({ children, htmlFor }) {
    return (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-sand-300">
            {children}
        </label>
    );
}

export function Error({ children }) {
    if (!children) return null;
    return <p className="mt-1 text-xs text-clay-500">{children}</p>;
}

export function TextInput(props) {
    return (
        <input
            {...props}
            className={`w-full rounded-lg border border-soil-700 bg-soil-900 px-3.5 py-2.5 text-sm text-sand-100 placeholder:text-sand-500/60 focus:border-yolk-500 focus:ring-yolk-500 ${props.className || ''}`}
        />
    );
}

export function Textarea(props) {
    return (
        <textarea
            {...props}
            className={`w-full rounded-lg border border-soil-700 bg-soil-900 px-3.5 py-2.5 text-sm text-sand-100 placeholder:text-sand-500/60 focus:border-yolk-500 focus:ring-yolk-500 ${props.className || ''}`}
        />
    );
}

export function Select(props) {
    return (
        <select
            {...props}
            className={`w-full rounded-lg border border-soil-700 bg-soil-900 px-3.5 py-2.5 text-sm text-sand-100 focus:border-yolk-500 focus:ring-yolk-500 ${props.className || ''}`}
        />
    );
}

export function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex cursor-pointer items-center gap-3">
            <span className="relative inline-flex h-6 w-11 items-center">
                <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
                <span className="h-6 w-11 rounded-full bg-soil-700 transition peer-checked:bg-pasture-500" />
                <span className="absolute left-0.5 h-5 w-5 rounded-full bg-sand-100 transition peer-checked:translate-x-5" />
            </span>
            <span className="text-sm text-sand-300">{label}</span>
        </label>
    );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
    const variants = {
        primary: 'bg-yolk-500 text-soil-950 hover:bg-yolk-400',
        ghost: 'border border-soil-700 text-sand-100 hover:border-yolk-600',
        danger: 'bg-clay-500/15 text-clay-500 hover:bg-clay-500/25',
    };
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
