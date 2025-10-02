// ---
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont')
const smallMenu = document.querySelector('.header__sm-menu')
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu')
const headerHamMenuCloseBtn = document.querySelector(
  '.header__main-ham-menu-close'
)
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

hamMenuBtn.addEventListener('click', () => {
  if (smallMenu.classList.contains('header__sm-menu--active')) {
    smallMenu.classList.remove('header__sm-menu--active')
  } else {
    smallMenu.classList.add('header__sm-menu--active')
  }
  if (headerHamMenuBtn.classList.contains('d-none')) {
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  } else {
    headerHamMenuBtn.classList.add('d-none')
    headerHamMenuCloseBtn.classList.remove('d-none')
  }
})

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
  headerSmallMenuLinks[i].addEventListener('click', () => {
    smallMenu.classList.remove('header__sm-menu--active')
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  })
}

// --- Subtle scroll/wheel parallax animation
;(function () {
  const hero = document.querySelector('.home-hero__content')
  const header = document.querySelector('.header')
  if (!hero && !header) return

  let velocity = 0
  let rafId = null

  function onWheel(e) {
    // normalize delta (positive when scrolling down)
    const delta = Math.max(-100, Math.min(100, e.deltaY || e.detail || 0))
    // small nudge proportional to delta
    velocity += delta * 0.02
    if (!rafId) rafId = requestAnimationFrame(tick)
  }

  function tick() {
    // apply transforms
    // clamp velocity
    velocity *= 0.92 // decay

    const heroTranslate = Math.max(-18, Math.min(18, -velocity * 0.7))
    const headerTranslate = Math.max(-8, Math.min(8, -velocity * 0.25))

    if (hero) hero.style.transform = `translate(-50%, calc(-50% + ${heroTranslate}px))`
    if (header) header.style.transform = `translateY(${headerTranslate}px)`

    // stop when velocity is tiny
    if (Math.abs(velocity) < 0.01) {
      // reset transforms smoothly
      if (hero) hero.style.transform = ''
      if (header) header.style.transform = ''
      cancelAnimationFrame(rafId)
      rafId = null
      velocity = 0
      return
    }

    rafId = requestAnimationFrame(tick)
  }

  // throttle wheel to rAF-friendly updates
  window.addEventListener('wheel', onWheel, { passive: true })
  // also handle touchpads / keyboard scroll fallback
  window.addEventListener('scroll', () => {
    // small artificial nudge when user scrolls normally
    if (!rafId) {
      velocity += 2
      rafId = requestAnimationFrame(tick)
    }
  }, { passive: true })
})()

// --- Contact form: open Gmail compose with pre-filled values (or mailto fallback)
;(function () {
  const contactForm = document.querySelector('.contact__form')
  if (!contactForm) return

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const dest = contactForm.dataset.destination || ''
    const name = (contactForm.querySelector('[name="name"]').value || '').trim()
    const email = (contactForm.querySelector('[name="email"]').value || '').trim()
    const message = (contactForm.querySelector('[name="message"]').value || '').trim()

    if (!name || !email || !message) {
      alert('Please fill in name, email and message before submitting.')
      return
    }

    const subject = encodeURIComponent(`Contact from portfolio: ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)

    // If a Gmail destination is provided, open Gmail compose URL in a new tab
    if (dest && dest.includes('@gmail.com')) {
      const gmailUrl = `https://saologan9@gmail.com/mail/?view=cm&fs=1&to=${encodeURIComponent(dest)}&su=${subject}&body=${body}`
      window.open(gmailUrl, '_blank')
      return
    }

    // Fallback to mailto (opens default mail client)
    const mailto = `mailto:${encodeURIComponent(dest || '')}?subject=${subject}&body=${body}`
    window.location.href = mailto
  })
})()

// ---
const headerLogoConatiner = document.querySelector('.header__logo-container')

headerLogoConatiner.addEventListener('click', () => {
  location.href = 'index.html'
})

// --- Flow-in animation for experience timeline items
const timelineItems = document.querySelectorAll('.timeline-item')

if ('IntersectionObserver' in window && timelineItems.length) {
  const obsOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.05,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // staggered reveal
        const el = entry.target
        const delay = el.dataset.index ? parseInt(el.dataset.index) * 80 : 0
        setTimeout(() => el.classList.add('in-view'), delay)
        observer.unobserve(el)
      }
    })
  }, obsOptions)

  timelineItems.forEach((item, i) => {
    item.dataset.index = i
    observer.observe(item)
  })
}
