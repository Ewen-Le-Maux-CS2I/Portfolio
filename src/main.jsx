import { render } from 'preact'
import { Buffer } from 'buffer'
import './index.css'
import { App } from './app.jsx'

// Polyfill Buffer pour gray-matter
window.Buffer = Buffer

render(<App />, document.getElementById('app'))
