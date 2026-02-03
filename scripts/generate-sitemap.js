import { writeFileSync } from 'fs'
import { join } from 'path'

const baseUrl = 'https://rk-weather.netlify.app'

const pages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/forecast', priority: '0.9', changefreq: 'hourly' },
  { url: '/cities', priority: '0.8', changefreq: 'daily' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`

// Crée le dossier public s'il n'existe pas
const publicDir = join(process.cwd(), 'public')
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)

console.log('✅ Sitemap generated successfully!')