'use client'

import { VendorListBaseProps } from '@/types/vendor'
import Image from 'next/image'

export const VendorMarkerBase = ({
  data,
  onItemClick,
}: VendorListBaseProps) => {
  const Component = onItemClick ? 'button' : 'div'

  return (
    <>
      <Component
        id={`marker-${data.id}`}
        onClick={
          onItemClick
            ? () => {
                onItemClick?.(data)
              }
            : undefined
        }
      >
        <div className="flex flex-col items-center">
          <Image
            src={data.markerImage}
            alt={`마커이미지 ${data.name}`}
            width={data.markerImgWidth}
            height={data.markerImgHeight}
          />
          {/* 테일윈드에 text-stroke가 없으므로 text-shadow로 대체 */}
          <div
            className="text-sm font-bold text-gray-700 
          [text-shadow:1px_1px_0_white,-1px_1px_0_white,1px_-1px_0_white,-1px_-1px_0_white]"
          >
            {data.name}
          </div>
        </div>
      </Component>
    </>
  )
}
