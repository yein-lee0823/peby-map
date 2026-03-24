'use client';

import { useState } from 'react';
import { useEffect, useMemo } from 'react';
import Navermap from './NaverMap';
import MarkerLayer from './MarkerLayer';
import ClusterLayer from './ClusterLayer';
import { VendorsListDto } from '@/api/dto/vendorsDto';
import { getVendorsList } from '@/api/vendors';
import { ExMarker } from '@/components/Map/ExMarker';
import { useMapStore } from '@/store/mapStore';

export default function Map() {
  const isMapLoaded = useMapStore((s) => s.isMapLoaded);
  const mapStore = useMapStore((s) => s.mapStore);
  const layerVisible = useMapStore((s) => s.layerVisible);
  const setLayerVisible = useMapStore((s) => s.setLayerVisible);

  const [vendorList, setVendorList] = useState<VendorsListDto[]>([]);

  // 각 레이어에 삽입될 필터 값
  // const hospitalVendors = vendorList.filter(
  //   (vendor) => vendor.category === 'hospital',
  // );
  // const shopVendors = vendorList.filter((vendor) => vendor.category === 'shop');

  const filterData = vendorList;

  // 클러스터 배열
  // const clusterData = useMemo(() => {
  //   return [
  //     ...(layerVisible.layer1 ? hospitalVendors : []),
  //     ...(layerVisible.layer2 ? shopVendors : []),
  //   ];
  // }, [layerVisible, hospitalVendors, shopVendors]);

  const clusterData = filterData;

  //  마커 클릭 이벤트
  const handleMarkerClick = (data: VendorsListDto) => {
    // todo 상세 띄우기
    console.log(data);
  };

  // 리페칭 함수 (필터, 검색)
  const fetchMapData = async (map: naver.maps.Map) => {
    const center = map.getCenter();
    console.log('페칭함수', center);

    const res = await getVendorsList(center.x, center.y);
    if (res) setVendorList(res.data);
    return;
  };

  useEffect(() => {
    if (!isMapLoaded || !mapStore) return;
    const fetchData = async () => {
      await fetchMapData(mapStore);
    };
    fetchData();
  }, [isMapLoaded, mapStore]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex min-h-screen w-full flex-col justify-content-between items-center">
          <Navermap refetch={fetchMapData} />

          <div className="bg-white p-2 absolute z-10 right-0 top-0">
            <label>
              <input
                type="checkbox"
                checked={layerVisible.layer1}
                onChange={() => {
                  setLayerVisible({ layer1: !layerVisible.layer1 });
                }}
              />
              레이어1
            </label>
            <label>
              <input
                type="checkbox"
                checked={layerVisible.layer2}
                onChange={() => {
                  setLayerVisible({ layer2: !layerVisible.layer2 });
                }}
              />
              레이어2
            </label>
          </div>

          <MarkerLayer
            vendors={filterData}
            onItemClick={handleMarkerClick}
            layerKey="layer1"
            MarkerComponent={ExMarker}
          />

          <MarkerLayer
            vendors={filterData}
            onItemClick={handleMarkerClick}
            layerKey="layer2"
          />

          <ClusterLayer vendors={clusterData} />
        </div>
      </div>
    </>
  );
}
