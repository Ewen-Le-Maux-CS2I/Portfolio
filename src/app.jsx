import Router from 'preact-router'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'
import { Portfolio } from './pages/Portfolio'
import { Layout } from './components/Layout'

const basePath = import.meta.env.BASE_URL

export function App() {
  return (
    <Layout basePath={basePath}>
      <Router>
        <Home path={`${basePath}`} />
        <Blog path={`${basePath}blog`} />
        <Portfolio path={`${basePath}portfolio`} />
      </Router>
    </Layout>
  )
}
