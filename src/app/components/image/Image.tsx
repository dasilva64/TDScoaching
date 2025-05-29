import { getImageProps } from "next/image"

export default function Image(props: any) {
  const { props: nextProps } = getImageProps({
    ...props
  })

  const { style: _omit, ...delegated } = nextProps

  return <img {...delegated} />
}