import Header from '@/components/Header'
import Hero from '@/components/Hero'
import SectionContainer from '@/components/SectionContainer'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { allCoreContent, sortedBlogPost } from '@/lib/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { InferGetStaticPropsType } from 'next'

export const getStaticProps = async () => {
  const sortedPosts = sortedBlogPost(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return { props: { posts } }
}

export default function Home() {
  return (
    <>
      <PageSEO title={siteMetadata.author} description={siteMetadata.description} />
      <SectionContainer>
        <Header />
      </SectionContainer>
      <Hero />
    </>
  )
}
