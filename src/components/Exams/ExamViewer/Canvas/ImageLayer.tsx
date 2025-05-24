"use client"

import { Image } from "react-konva"
import { useEffect, useState } from "react"

interface ImageLayerProps {
  image: HTMLImageElement | null
  position: { x: number; y: number }
  zoom: number
}

export const ImageLayer = ({ image, position, zoom }: ImageLayerProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (image && image.complete) {
      setImageLoaded(true)
    } else if (image) {
      const handleLoad = () => setImageLoaded(true)
      image.addEventListener("load", handleLoad)
      return () => image.removeEventListener("load", handleLoad)
    }
  }, [image])

  if (!image || !imageLoaded) return null

  return <Image image={image} x={position.x} y={position.y} scaleX={zoom} scaleY={zoom} listening={false} />
}
