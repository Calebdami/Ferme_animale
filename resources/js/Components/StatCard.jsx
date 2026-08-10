export default function StatCard({ value, label }) {
    if (!value) return null;
    return (
        <div className="rounded-xl border border-soil-700 bg-soil-900/60 p-4 text-center sm:p-5">
            <p className="font-display text-2xl font-semibold text-yolk-400 sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs text-sand-500 sm:text-sm">{label}</p>
        </div>
    );
}
