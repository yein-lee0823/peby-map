'use client';

import { VendorListBaseProps } from '@/types/vendor';
// import Image from 'next/image';

export const VendorMarkerBase = ({
  data,
  onItemClick,
}: VendorListBaseProps) => {
  const Component = onItemClick ? 'button' : 'div';

  const markerData = data.businessList[0]?.business;

  return (
    <>
      <Component
        id={`marker-${markerData.placeId}`}
        onClick={
          onItemClick
            ? () => {
                onItemClick?.(data);
              }
            : undefined
        }
      >
        <div className="flex flex-col items-center">
          {/* todo : api 데이터에 이미지 추가 */}
          {/* <Image
            src={markerData.image}
            alt={`마커이미지 ${markerData.name}`}
            width={markerData.ImgWidth ?? 30}
            height={markerData.ImgHeight}
          /> */}
          {/* 테일윈드에 text-stroke가 없으므로 text-shadow로 대체 */}
          <div
            className="text-sm font-bold text-gray-700 
          [text-shadow:1px_1px_0_white,-1px_1px_0_white,1px_-1px_0_white,-1px_-1px_0_white]"
          >
            {markerData.name}
          </div>
        </div>
      </Component>
    </>
  );
};
