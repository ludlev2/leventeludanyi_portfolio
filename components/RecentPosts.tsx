import PostCard from '@/components/PostCard'
import { Blog } from 'contentlayer/generated'
import Link from 'next/link'

const MAX_DISPLAY = 0

interface RecentPosts {
  posts: Omit<Blog, 'body' | '_raw' | '_id'>[]
}

export default function RecentPosts({ posts }: RecentPosts) {
  const slicedPost = posts.slice(0, MAX_DISPLAY)

  return (
    <>
      <div className="divide-gray-200 dark:divide-gray-700">
        <PostCard posts={slicedPost} showTags={false} />
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link href="mailto: ludanyi.levente@gmail.com">
            <span className="underline-magical font-bold cursor-pointer" aria-label="all posts">
              Get in touch &rarr;
            </span>
          </Link>
        </div>
      )}
    </>
  )
}
