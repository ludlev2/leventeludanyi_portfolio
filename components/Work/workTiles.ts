export type WorkTile = {
  title: string
  description: string
  image: {
    src: string
    width: number
    height: number
  }
}

export const workTiles: WorkTile[] = [
  {
    description: `Here is`,
    title: `what I've been up to`,
    image: {
      src: '/static/images/emoji.png',
      width: 600,
      height: 770,
    },
  },
  {
    description: 'I co-founded a company called',
    title: 'PointSwitch',
    image: {
      src: '/static/images/product_iphone-4.webp',
      width: 600,
      height: 554,
    },
  },
  {
    description: 'I was a quant researcher at',
    title: 'WorldQuant',
    image: {
      src: '/static/images/trading.webp',
      width: 600,
      height: 717,
    },
  },
  {
    description: `President of the`,
    title: 'Algorithmic Trading Society',
    image: {
      src: '/static/images/algorithmic_trading.webp',
      width: 600,
      height: 717,
    },
  },
  {
    description: `Head of Finance and Analytics at`,
    title: 'Future: Hungary',
    image: {
      src: '/static/images/FH.png',
      width: 600,
      height: 717,
    },
  },
]
