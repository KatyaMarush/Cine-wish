import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const resolve = (p: string) => path.resolve(__dirname, p)

async function createServer() {
  const app = express()

  let vite: import('vite').ViteDevServer | undefined
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)
  } else {
    app.use(express.static(resolve('dist/client')))
  }

  app.use('*', async (req, res) => {
    try {
      const _url = req.originalUrl

      let template: string
      let render: (_url: string) => Promise<string>

      if (!isProd) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite!.transformIndexHtml(_url, template)
        render = (await vite!.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        render = (await import('./dist/server/entry-server.js')).render as (
          _url: string,
        ) => Promise<string>
      }

      const appHtml = await render(_url)
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e: unknown) {
      const error = e as Error
      vite?.ssrFixStacktrace(error)
      res.status(500).end(error.stack)
    }
  })

  app.listen(5173, () => {
    console.log('Server started at http://localhost:5173')
  })
}

createServer()
