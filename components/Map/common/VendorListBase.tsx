'use client'

import Image from 'next/image'
import { VendorListBaseProps } from '@/types/vendor'
import { useRouter } from 'next/navigation'

export const VendorListBase = ({ data, onItemClick }: VendorListBaseProps) => {
  const Component = onItemClick ? 'button' : 'div'
  const router = useRouter()

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick(data)
      return
    }

    router.push(`/map/${data.id}`)
  }

  return (
    <>
      <Component
        className="flex gap-2"
        onClick={onItemClick ? handleItemClick : undefined}
      >
        <div>
          <Image
            src={data.thumbnail}
            alt={`썸네일 ${data.name}`}
            width={data.imgWidth}
            height={data.imgHeight}
          />
        </div>
        <div className="text-left">
          <div className="font-semibold">{data.name}</div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {data.category}
          </div>
        </div>
      </Component>
    </>
  )
}
