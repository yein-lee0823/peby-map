'use client';

import { VendorListBaseProps } from '@/types/vendor';
import { VendorMarkerBase } from './common/VendorMarkerBase';

export const HospitalMarker = ({ data, onItemClick }: VendorListBaseProps) => {
  const handleClick = () => {
    // visitedMarker만의 로직
    onItemClick?.(data);
    console.log('HospitalMarker만의 로직');
  };

  return (
    <div className="hospital-marker-wrapper">
      <VendorMarkerBase data={data} onItemClick={handleClick} />
      {/* UI 추가 */}
    </div>
  );
};
