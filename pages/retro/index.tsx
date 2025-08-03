import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import styles from './styles/RetroSpace.module.css'

const RetroSpace: React.FC = () => {
  const [clickCount, setClickCount] = useState(0)
  const [visitorNumber, setVisitorNumber] = useState(0)
  const [currentMood, setCurrentMood] = useState(0)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'SYSTEM READY',
    "> Type 'help' for commands",
  ])

  const starsRef = useRef<HTMLDivElement>(null)
  const spaceInvadersRef = useRef<HTMLDivElement>(null)
  const moodRingRef = useRef<HTMLDivElement>(null)
  const asciiArtRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    createStars()
    createSpaceInvaders()
    setVisitorNumber(Math.floor(Math.random() * 1000) + 1)
  }, [])

  const createStars = () => {
    if (starsRef.current) {
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div')
        star.classList.add(styles.star)
        star.style.left = `${Math.random() * 100}%`
        star.style.top = `${Math.random() * 100}%`
        star.style.animationDelay = `${Math.random() * 3}s`
        starsRef.current.appendChild(star)
      }
    }
  }

  const createSpaceInvaders = () => {
    if (spaceInvadersRef.current) {
      for (let i = 0; i < 5; i++) {
        const invader = document.createElement('span')
        invader.textContent = '👾'
        invader.classList.add(styles.spaceInvader)
        invader.addEventListener('click', function (this: HTMLSpanElement) {
          this.style.transform = 'scale(0)'
          setTimeout(() => this.remove(), 500)
        })
        spaceInvadersRef.current.appendChild(invader)
      }
    }
  }

  const handleDoNotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const messages = [
      'I told you not to click!',
      'Why did you click again?',
      'Stop clicking!',
      'Are you testing me?',
      'This button does nothing... or does it?',
    ]
    setClickCount((prevCount) => {
      const newCount = prevCount + 1
      if (newCount === 10) {
        document.body.style.animation = 'rotate3D 5s linear infinite'
      }
      return newCount
    })
    e.currentTarget.textContent = messages[Math.min(clickCount, messages.length - 1)]
  }

  const handleTerminalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = e.currentTarget.value.toLowerCase()
      let response = ''
      switch (command) {
        case 'help':
          response = 'Available commands: help, date, random, about, ascii'
          break
        case 'date':
          response = `Current stardate: ${getStardate()}`
          break
        case 'random':
          response = `Random space fact: ${getRandomSpaceFact()}`
          break
        case 'about':
          response =
            'RetroSpace Odyssey 3000 - A journey through the digital cosmos and alternate dimensions'
          break
        case 'ascii':
          response = 'ASCII art generated!'
          generateASCIIArt()
          break
        default:
          response = 'Unknown command. Type "help" for available commands.'
      }
      setTerminalOutput((prev) => [...prev, `> ${command}`, response])
      e.currentTarget.value = ''
    }
  }

  const getRandomSpaceFact = () => {
    const facts = [
      'A year on Mercury is just 88 days long.',
      'Despite being farther from the Sun, Venus is hotter than Mercury.',
      'Sound cannot travel in space because there is no air.',
      'The footprints on the Moon will be there for 100 million years.',
      'One day on Venus is longer than one year on Earth.',
    ]
    return facts[Math.floor(Math.random() * facts.length)]
  }

  const getStardate = () => {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - startOfYear.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const day = Math.floor(diff / oneDay)
    return `${now.getFullYear()}.${day}`
  }

  const handleMoodPlanetClick = () => {
    const moodColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
    setCurrentMood((prevMood) => (prevMood + 1) % moodColors.length)
    if (moodRingRef.current) {
      moodRingRef.current.style.backgroundColor = moodColors[currentMood]
    }
  }

  const generateASCIIArt = () => {
    const art = `
    /\\
   /  \\
  /----\\
 /      \\
/________\\
`
    if (asciiArtRef.current) {
      asciiArtRef.current.textContent = art
    }
  }

  return (
    <div className={styles.body}>
      <Head>
        <title>RetroSpace Odyssey 3000</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={styles.stars} ref={starsRef}></div>
      <div className={styles.container}>
        <div className={styles.ufo}></div>
        <h1 className={`${styles.h1} ${styles.glitch}`}>RetroSpace Odyssey 3000</h1>
        <div className={styles.underConstruction}>UNDER CONSTRUCTION</div>
        <div className={styles.contentWrapper}>
          <div className={styles.rotatingTextVertical}>
            <span>R</span>
            <span>E</span>
            <span>T</span>
            <span>R</span>
            <span>O</span>
          </div>
          <div className={styles.centerContent}>
            <button
              className={styles.planet}
              id="mood-planet"
              onClick={handleMoodPlanetClick}
              aria-label="Click the mood planet"
            ></button>
            <p>Welcome to my interdimensional homepage on the Intergalactic Web!</p>
            <button className={styles.button} id="do-not-click" onClick={handleDoNotClick}>
              Do not click
            </button>
            <div id="visitor-message">You are visitor number: {visitorNumber}</div>
            <p>
              Stardate: <span id="stardate">{getStardate()}</span>
            </p>
          </div>
          <div className={styles.rotatingTextHorizontal}>
            <span>H</span>
            <span>O</span>
            <span>M</span>
            <span>E</span>
          </div>
        </div>
        <div id="space-invaders" ref={spaceInvadersRef}></div>
        <div id="mood-ring" ref={moodRingRef}></div>
        <div className={styles.retroTerminal}>
          {terminalOutput.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <input
            type="text"
            id="terminal-input"
            placeholder="Enter command..."
            onKeyPress={handleTerminalInput}
          />
        </div>
        <div id="ascii-art" ref={asciiArtRef}></div>
      </div>
    </div>
  )
}

export default RetroSpace
