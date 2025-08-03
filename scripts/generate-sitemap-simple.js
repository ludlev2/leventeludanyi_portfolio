const fs = require('fs')
const path = require('path')

const siteUrl = 'https://ludanyi.me'

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/projects</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/uses</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/tags</loc>
    <priority>0.6</priority>
  </url>
</urlset>`

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap)
console.log('Sitemap generated successfully!')
