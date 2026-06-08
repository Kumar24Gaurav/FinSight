function SummaryCard({ title, value, subtitle, icon, iconBg }) {
    return (
        <div className="bg-white rounded-2xl shadow p-5 min-h-[170px]">

            <div className="flex justify-between items-start gap-4">

                <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        {title}
                    </p>
                </div>

                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${iconBg}`}
                >
                    {icon}
                </div>

            </div>

            <h2 className="text-3xl font-bold mt-4 text-slate-900">
                {value}
            </h2>

            {subtitle && (
                <p className="text-sm text-slate-500 mt-2">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

export default SummaryCard;