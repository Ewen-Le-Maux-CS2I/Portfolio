import { AppWindow } from '../components/AppWindows'

export function Portfolio() {
  return (
    <div className="max-w-[1280px] w-full mx-auto">
      <AppWindow title="Portfolio">
        <div className="alert alert-info">
          <span>Les projets seront chargés depuis les fichiers Markdown.</span>
        </div>
      </AppWindow>
    </div>
  )
}
