export function AppWindow({ title, children, actions, className = '', headerLayout = 'row' }) {
  const isColumn = headerLayout === 'column'
  return (
    <div className={`bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-[1280px] w-full mx-auto ${className}`}>
      <div className={`bg-slate-50 border-b border-slate-100 px-6 py-4 ${isColumn ? 'flex flex-col items-start gap-3' : 'flex items-center justify-between'}`}>
        {isColumn ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
            </div>
            {actions}
            {title ? (
              <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
            ) : null}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              {title ? (
                <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
              ) : null}
            </div>
            {actions}
          </>
        )}
      </div>
      <div className="p-8 space-y-4">{children}</div>
    </div>
  )
}