import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'

export async function render(url: string) {
  try {
    return renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
    )
  } catch (err) {
    console.error('SSR error:', err)
    return `<div>Something went wrong</div>`
  }
}
