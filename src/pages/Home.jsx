const basePath = import.meta.env.BASE_URL

export function Home() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-6 text-slate-50">

        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow">Ewen</h1>
          <p className="text-lg md:text-xl text-slate-200 italic">Développeur Full Stack</p>
        </div>
      </div>
    </div>
  )
}
