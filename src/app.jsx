import Router from 'preact-router'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'
import { Portfolio } from './pages/Portfolio'

const basePath = import.meta.env.BASE_URL

export function App() {
  return (
    <Router>
      <Home path={`${basePath}`} />
      <Blog path={`${basePath}blog`} />
      <Portfolio path={`${basePath}portfolio`} />
    </Router>
  )
}
