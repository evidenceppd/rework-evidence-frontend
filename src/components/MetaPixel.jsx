import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const META_PIXEL_ID = '1568630248381918'
const PIXEL_SCRIPT_ID = 'facebook-meta-pixel-script'
let isPixelInitialized = false

function initMetaPixel() {
  if (typeof window === 'undefined' || isPixelInitialized) return

  const pixel = (window.fbq = function () {
    pixel.callMethod
      ? pixel.callMethod.apply(pixel, arguments)
      : pixel.queue.push(arguments)
  })

  if (!window._fbq) {
    window._fbq = pixel
  }
  pixel.push = pixel
  pixel.loaded = true
  pixel.version = '2.0'
  pixel.queue = []

  if (!document.getElementById(PIXEL_SCRIPT_ID)) {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    script.id = PIXEL_SCRIPT_ID
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)
  }

  window.fbq('init', META_PIXEL_ID)
  isPixelInitialized = true
}

export default function MetaPixel() {
  const location = useLocation()

  useEffect(() => {
    initMetaPixel()
  }, [])

  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
  }, [location.pathname, location.search, location.hash])

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )
}
