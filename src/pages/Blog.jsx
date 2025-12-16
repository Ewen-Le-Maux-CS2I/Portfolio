import { AppWindow } from '../components/AppWindows'

export function Blog() {
  return (
    <div className="max-w-[1280px] w-full mx-auto">
      <AppWindow title="Blog">
        <div className="alert alert-info">
          <span>Les articles seront chargés depuis les fichiers Markdown.</span>
        </div>
      </AppWindow>
    </div>
  )
}
