const fs = require('fs')
const path = require('path')

const siteUrl = 'https://ludanyi.me'
const author = 'Levente Ludanyi'
const email = 'levente@ludanyi.me'

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${author}</title>
    <link>${siteUrl}/blog</link>
    <description>Mathematics and Computer Science student at École Polytechnique, Co-Founder at Margin</description>
    <language>en-us</language>
    <managingEditor>${email} (${author})</managingEditor>
    <webMaster>${email} (${author})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
  </channel>
</rss>`

fs.writeFileSync(path.join(__dirname, '../public/feed.xml'), rss)
console.log('RSS feed generated successfully!')
