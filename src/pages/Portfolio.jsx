export function Portfolio() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">Portfolio</h1>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="alert alert-info">
            <span>Les projets seront chargés depuis les fichiers Markdown.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
