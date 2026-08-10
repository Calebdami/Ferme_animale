import Eyebrow from './Eyebrow';

export default function SectionTitle({ eyebrow, title, subtitle, align = 'left' }) {
    return (
        <div className={align === 'center' ? 'text-center' : 'text-left'}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="font-display text-3xl font-semibold leading-tight text-sand-100 sm:text-4xl">
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-3 max-w-2xl text-sand-500 ${align === 'center' ? 'mx-auto' : ''}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
