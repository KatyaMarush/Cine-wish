import type { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs'
import path from 'path'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = (req.query.path as string) || req.url || '/'
    const cleanUrl = url.startsWith('/') ? url : `/${url}`

    const distClient = path.join(process.cwd(), 'dist/client')

    const templatePath = path.join(distClient, 'index.html')
    const template = fs.readFileSync(templatePath, 'utf-8')

    const { render } = await import(path.join(distClient, 'entry-server.js'))
    const appHtml = await (render as (url: string) => Promise<string>)(cleanUrl)

    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    res.status(200).setHeader('Content-Type', 'text/html').end(html)
  } catch (error) {
    console.error('SSR error:', error)
    res.status(500).send('Server error')
  }
}
