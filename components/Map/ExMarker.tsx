'use client';

import { VendorListBaseProps } from '@/types/vendor';
import { VendorMarkerBase } from './common/VendorMarkerBase';

export const ExMarker = ({ data, onItemClick }: VendorListBaseProps) => {
  const handleClick = () => {
    onItemClick?.(data);
    console.log('로직 추가');
  };

  return (
    <div className="ex-marker-wrapper">
      <VendorMarkerBase data={data} onItemClick={handleClick} />
      {/* UI 추가 */}
    </div>
  );
};
