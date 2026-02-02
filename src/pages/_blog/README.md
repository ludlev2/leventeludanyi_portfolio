# Blog (Hidden)

This folder contains the blog pages. It's prefixed with `_` so Astro ignores it and doesn't generate routes.

## Contents

- `index.astro` - Blog listing page with year-grouped posts
- `[...slug].astro` - Individual blog post pages

## To Re-enable

1. Rename this folder:
   ```bash
   mv src/pages/_blog src/pages/blog
   ```

2. Uncomment the nav link in `src/lib/site-config.ts`:
   ```ts
   nav: [
     { name: 'blog', href: '/blog' }, // Uncomment this
     { name: 'projects', href: '/projects' },
     { name: 'about', href: '/about' },
   ],
   ```

3. Uncomment the button in `src/pages/index.astro` (around line 31-35):
   ```astro
   <a href="/blog" class="btn">
     Blog
   </a>
   ```

## Adding Blog Posts

Blog posts go in `src/content/blog/` as `.mdx` files. Example:

```mdx
---
title: "My First Post"
date: 2024-01-15
summary: "A brief description"
tags: ["engineering", "startups"]
draft: false
---

Your content here...
```
