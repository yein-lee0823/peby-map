'use client';

// import Image from 'next/image'
import { VendorListBaseProps } from '@/types/vendor';
import { useRouter } from 'next/navigation';

export const VendorListBase = ({ data, onItemClick }: VendorListBaseProps) => {
  const Component = onItemClick ? 'button' : 'div';
  const router = useRouter();

  const listData = data.businessList[0]?.business;

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick(data);
      return;
    }

    router.push(`/map/${listData.placeId}`);
  };

  return (
    <>
      <Component
        className="flex gap-2"
        onClick={onItemClick ? handleItemClick : undefined}
      >
        <div>
          {/* todo : api 데이터에 이미지 추가 */}
          {/* <Image
            src={listData.image}
            alt={`썸네일 ${listData.name}`}
            width={listData.imgWidth ?? 50}
            height={listData.imgHeight ?? 50}
          /> */}
        </div>
        <div className="text-left">
          <div className="font-semibold">{listData.name}</div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {listData.businessType}
          </div>
        </div>
      </Component>
    </>
  );
};
