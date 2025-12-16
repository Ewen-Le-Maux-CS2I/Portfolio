export function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Portfolio & Blog</h1>
            <p className="py-6">
              Bienvenue sur mon site personnel. Découvrez mes projets et mes articles.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/portfolio" className="btn btn-primary">
                Voir le Portfolio
              </a>
              <a href="/blog" className="btn btn-secondary">
                Lire le Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
