import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { renderCanvas } from './renderCanvas'
import { ScrollContext } from './ScrollObserver'

export default function Hero(): ReactElement {
  const ref = useRef<HTMLHeadingElement>(null)
  const { scrollY } = useContext(ScrollContext)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  let progress = 0
  const { current: elContainer } = ref

  if (elContainer) {
    const scrollThreshold = elContainer.clientHeight * 0.1
    progress = Math.min(1, scrollY / scrollThreshold)
  }

  useEffect(() => {
    // Function to check if the device is mobile or tablet based on screen width
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobileOrTablet(width < 1024) // Typically, 1024px is the breakpoint for desktop
    }

    // Check initially
    checkDevice()

    // Add resize listener
    window.addEventListener('resize', checkDevice)

    // Initialize the canvas animation for all devices
    renderCanvas()

    // Clean up event listener
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    // For mobile and tablet: prevent scrolling on the Hero section
    const preventScroll = (e: TouchEvent) => {
      // Only prevent default if we're on the Hero section
      const heroSection = document.querySelector('.hero-section')
      if (heroSection && heroSection.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    // Add touch event listeners to prevent scrolling only on mobile/tablet
    if (isMobileOrTablet) {
      document.addEventListener('touchmove', preventScroll, { passive: false })
    }

    // Clean up event listeners
    return () => {
      if (isMobileOrTablet) {
        document.removeEventListener('touchmove', preventScroll)
      }
    }
  }, [isMobileOrTablet])

  return (
    <div className="relative hero-section">
      <h1 className="sr-only">Hi I'm Levente Ludanyi, I'm building Margin.</h1>
      <motion.div
        className="relative z-10 flex h-[calc(100vh-81px)] md:h-[calc(100vh-116px)] items-center"
        animate={{
          transform: `translateY(${progress * 20}vh)`,
        }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <div className="w-screen px-4 max-w-3xl mx-auto sm:px-9 xl:max-w-5xl xl:px-0">
          <div className="-mt-36">
            <div ref={ref} className="flex flex-col space-y-2 cursor-default">
              {
                // <FadeUp duration={0.6}>
              }
              <h1 className="font-semibold text-5xl sm:text-7xl md:text-8xl xl:text-9xl">
                Levente Ludányi
              </h1>
              {
                // </FadeUp>
              }

              {
                // <FadeRight duration={0.5} delay={0.8}>
              }
              <Link
                href="/about"
                className="underline-magical cursor-pointer w-max text-md sm:text-lg md:text-xl xl:text-2xl"
              >
                Read more about me &rarr;
              </Link>
              {
                // </FadeRight>
              }
            </div>
            <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2">
              <div
                role="presentation"
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {
                  const intro = document.querySelector('#intro')
                  intro?.scrollIntoView({ behavior: 'smooth' })
                }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
      <canvas
        className="bg-skin-base pointer-events-none absolute top-0 left-0 w-full h-full"
        id="canvas"
      ></canvas>
    </div>
  )
}
