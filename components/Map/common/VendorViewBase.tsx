'use client';

// import Image from 'next/image';
import { VendorViewBaseProps } from '@/types/vendor';

export const VendorViewBase = ({ data }: VendorViewBaseProps) => {
  if (!data) {
    return null;
  }

  const viewData = data.business;

  return (
    <div className="flex gap-4">
      {/* todo : api 데이터에 이미지 추가 */}
      {/* <Image
        src={viewData.thumbnail}
        alt={viewData.name}
        width={viewData.imgWidth ?? 100}
        height={viewData.imgHeight ?? 100}
      /> */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">{viewData.name}</h3>
        <p className="text-sm text-gray-600 mb-1">
          카테고리: {viewData.businessType}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          운영시간: {viewData.businessHours}
        </p>
        {/* todo : 어디서 계산해서 넣을지 미정 */}
        {/* <p className="text-sm text-gray-600 mb-1">
          영업상태: {viewData.businessStatus}
        </p> */}
        {/* <p className="text-sm text-gray-600 mb-1">
          이용안내: {viewData.usageGuide}
        </p> */}
        <p className="text-sm text-gray-600 mb-1">
          전화번호: {viewData.contact}
        </p>
        <p className="text-sm text-gray-600 mb-1">주소: {viewData.address}</p>
      </div>
    </div>
  );
};
