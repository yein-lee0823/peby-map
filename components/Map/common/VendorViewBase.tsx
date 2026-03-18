'use client'

import Image from 'next/image'
import { VendorViewBaseProps } from '@/types/vendor'

export const VendorViewBase = ({ data }: VendorViewBaseProps) => {
  if (!data) {
    return null
  }

  return (
    <div className="flex gap-4">
      <Image
        src={data.thumbnail}
        alt={data.name}
        width={data.imgWidth}
        height={data.imgHeight}
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">{data.name}</h3>
        <p className="text-sm text-gray-600 mb-1">카테고리: {data.category}</p>
        <p className="text-sm text-gray-600 mb-1">
          운영시간: {data.operatingHours}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          영업상태: {data.businessStatus}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          이용안내: {data.usageGuide}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          전화번호: {data.phoneNumber}
        </p>
        <p className="text-sm text-gray-600 mb-1">주소: {data.address}</p>
      </div>
    </div>
  )
}
