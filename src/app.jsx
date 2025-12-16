import Router from 'preact-router'
import { useState } from 'preact/hooks'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'
import { Portfolio } from './pages/Portfolio'
import { Layout } from './components/Layout'

const basePath = import.meta.env.BASE_URL

export function App() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : basePath
  )

  return (
    <Layout basePath={basePath} currentPath={currentPath}>
      <Router onChange={({ url }) => setCurrentPath(url)}>
        <Home path={`${basePath}`} />
        <Blog path={`${basePath}blog`} />
        <Portfolio path={`${basePath}portfolio`} />
      </Router>
    </Layout>
  )
}