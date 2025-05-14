import { Image } from "react-konva"

interface ImageLayerProps {
  image: HTMLImageElement | null
  position: { x: number; y: number }
  zoom: number
}

export const ImageLayer = ({ image, position, zoom }: ImageLayerProps) => {
  if (!image) return null

  return <Image image={image} x={position.x} y={position.y} scaleX={zoom} scaleY={zoom} listening={false} />
}
