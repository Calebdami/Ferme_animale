export default function TestimonialCard({ testimonial }) {
    return (
        <div className="flex h-full flex-col rounded-xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-5 shadow-sm dark:shadow-none">
            <div className="mb-3 flex gap-0.5 text-yolk-500">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < testimonial.rating ? '★' : '☆'}</span>
                ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-sand-300">« {testimonial.content} »</p>
            <p className="mt-4 text-sm font-medium text-gray-900 dark:text-sand-100">
                {testimonial.author_name}
                {testimonial.author_role && (
                    <span className="block text-xs font-normal text-gray-400 dark:text-sand-500">{testimonial.author_role}</span>
                )}
            </p>
        </div>
    );
}
