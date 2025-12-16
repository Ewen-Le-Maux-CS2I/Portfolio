import Router from 'preact-router'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'
import { Portfolio } from './pages/Portfolio'

export function App() {
  return (
    <Router>
      <Home path="/" />
      <Blog path="/blog" />
      <Portfolio path="/portfolio" />
    </Router>
  )
}
