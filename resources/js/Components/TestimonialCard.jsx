export default function TestimonialCard({ testimonial }) {
    return (
        <div className="flex h-full flex-col rounded-xl border border-soil-700 bg-soil-900/60 p-5">
            <div className="mb-3 flex gap-0.5 text-yolk-500">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < testimonial.rating ? '★' : '☆'}</span>
                ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-sand-300">« {testimonial.content} »</p>
            <p className="mt-4 text-sm font-medium text-sand-100">
                {testimonial.author_name}
                {testimonial.author_role && (
                    <span className="block text-xs font-normal text-sand-500">{testimonial.author_role}</span>
                )}
            </p>
        </div>
    );
}
