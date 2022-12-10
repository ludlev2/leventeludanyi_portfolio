const siteMetadata = {
  title: 'Levente Ludanyi',
  author: 'Levente Ludanyi',
  headerTitle: 'leventeludanyi',
  description: 'Maths & CS major at Ecole Polytechnique, Co-Founder at PointSwitch',
  language: 'en-us',
  theme: 'dark', // system, dark or light
  siteUrl: 'https://ludlev2.github.io/leventeludanyi_portfolio/',
  siteRepo: 'https://github.com/dlarroder/dalelarroder-blog',
  siteLogo: '/static/images/logo.png',
  image: '/static/images/profpic_copy.jpg',
  socialBanner: '/static/images/twitter-card.png',
  email: 'ludanyi.levente@gmail.com',
  github: 'https://github.com/ludlev2',
  twitter: 'https://twitter.com/dalelarroder',
  facebook: 'https://www.facebook.com/ludanyi.lvnt',
  linkedin: 'https://www.linkedin.com/in/levente-ludanyi-1475aa204/',
  spotify: 'https://open.spotify.com/user/12162121994?si=e685b3546f414967',
  steam: 'https://steamcommunity.com/id/dlarroder/',
  locale: 'en-US',
  comment: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID || '',
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || '',
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
    },
  },
}

module.exports = siteMetadata
