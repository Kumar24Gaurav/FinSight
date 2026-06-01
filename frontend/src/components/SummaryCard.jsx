function SummaryCard({ title, value, icon, iconBg }) {
    return (
        <div className="bg-white rounded-2xl shadow p-5">

            <div className="flex justify-between items-start">

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
        </div>
    );
}

export default SummaryCard;