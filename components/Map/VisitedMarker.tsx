'use client'

import { VendorListBaseProps } from '@/types/vendor'
import { VendorMarkerBase } from './VendorMarkerBase'

export const VisitedMarker = ({ data, onItemClick }: VendorListBaseProps) => {
  const handleClick = () => {
    // visitedMarker만의 로직
    console.log('visitedMarker만의 로직')
  }

  return (
    <div className="visited-marker-wrapper">
      <VendorMarkerBase data={data} onItemClick={handleClick} />
    </div>
  )
}
