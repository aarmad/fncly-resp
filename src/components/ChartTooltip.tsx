"use client";

interface ChartTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl p-4 text-sm">
                <p className="font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest text-[10px]">{label}</p>
                {payload.map((entry: any) => (
                    <p
                        key={entry.name}
                        className="font-bold"
                        style={{ color: entry.fill || entry.color }}
                    >
                        {entry.name === "income" ? "Revenus" : entry.name === "expense" ? "Dépenses" : entry.name} :{" "}
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
}
