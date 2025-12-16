import Router from 'preact-router'
import { useState } from 'preact/hooks'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'
import { BlogArticle } from './pages/BlogArticle'
import { Portfolio } from './pages/Portfolio'
import { PortfolioProject } from './pages/PortfolioProject'
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
        <BlogArticle path={`${basePath}blog/:slug`} />
        <Portfolio path={`${basePath}portfolio`} />
        <PortfolioProject path={`${basePath}portfolio/:slug`} />
      </Router>
    </Layout>
  )
}