import { AppWindow } from '../components/AppWindows'

export function Portfolio() {
  return (
    <AppWindow title="Portfolio">
      <div className="alert alert-info">
        <span>Les projets seront chargés depuis les fichiers Markdown.</span>
      </div>
    </AppWindow>
  )
}
