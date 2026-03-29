import type { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = (req.query.path as string) || req.url || '/'
    const cleanUrl = url.startsWith('/') ? url : `/${url}`

    const distPath = path.join(process.cwd(), 'dist', 'client')

    const templatePath = path.join(distPath, 'index.html')
    const template = fs.readFileSync(templatePath, 'utf-8')

    const entryServerPath = path.join(distPath, 'entry-server.js')
    const { render } = await import(pathToFileURL(entryServerPath).href)
    const appHtml = await (render as (url: string) => Promise<string>)(cleanUrl)

    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    res.status(200).setHeader('Content-Type', 'text/html').end(html)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('SSR error:', message, error instanceof Error ? error.stack : '')
    res.status(500).send('Server error')
  }
}
