'use client'

import { RealListBase } from '@/components/Map/VendorListBase'
import { useState } from 'react'
import { useEffect } from 'react'
import { RealViewBase } from '@/components/Map/VendorViewBase'
import Navermap from './Map'
import { MapProvider } from './MapProvider'
import { Coordinates, NaverMap } from '@/types/map'
import MarkerOverlay from './CustomLayer'
import { mockVendorsList, myLocationData } from '@/api/mock/vendors'
import ClusterLayer from './ClusterLayer'
// import MarkerLayer from './MarkerLayer'
import { VendorsListDto, VendorsViewDto } from '@/api/dto/vendors.dto'
import { getVendorsDetail, getVendorsList } from '@/api/vendors'
// import { useVendorsStore } from '@/store/vendorStore'

// marker, list, view 여기 밖에서 데이터를 주는데
// 실제로 지도 가져와서 뿌린다고 했을때
// 어디에서 부르게 될지
// 일단 여기서 다 그려보자

export default function Map() {
  const [vendorList, setVendorList] = useState<VendorsListDto[]>([])
  // const [vendorDetail, setVendorDetail] = useState<VendorsViewDto>()
  // const [points, setPoints] = useState<Coordinates[]>([])
  // const [markerLoad, setMarkerLoad] = useState(false)
  // const setVendorStore = useVendorsStore((state) => state.setVendors)

  // 리스트 페치 영역
  // useEffect(() => {
  //   const fetchList = async () => {
  //     try {
  //       const data = await getVendorsList()
  //       setVendorList(data)
  //       // setVendorStore(data)
  //     } catch (error) {
  //       console.error('error:::', error)
  //     }
  //   }
  //   fetchList()
  // }, [])

  // 디테일 페치 영역
  // useEffect(() => {
  //   const fetchDetail = async () => {
  //     try {
  //       const detail = await getVendorsDetail(1)
  //       setVendorDetail(detail)
  //     } catch (error) {
  //       console.error('error:::', error)
  //     }
  //   }
  //   fetchDetail()
  // }, [])

  // 내 좌표 구하기 (api에 좌표 값을 쏘고 데이터 받아오기)

  // 클러스터 배열
  const clusterData = [...vendorList, ...vendorList]

  //  마커 클릭 이벤트
  const handleMarkerClick = (data: VendorsListDto) => {
    // todo 상세 띄우기
    console.log(data)
  }

  // 리페칭할 이벤트
  const handleMapIdle = async (map: NaverMap) => {
    const center = map.getCenter()
    const zoom = map.getZoom()
    console.log('페칭할 조건을 여기서 가지고 있음', center, zoom)
    const fetchData = await getVendorsList()
    setVendorList(fetchData)
    //   {
    //   lat: center.lat(),
    //   lng: center.lng(),
    //   zoom,
    //   filter,
    // }
  }

  useEffect(() => {
    console.log('페칭된값', vendorList)
  }, [vendorList])

  // todo: 이 페이지를 데이터 페칭하는 장소로 정하자

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex min-h-screen w-full flex-col justify-content-between items-center">
        {/* {vendorList.map((vendor) => (
          <div key={vendor.id}>
            <RealListBase data={vendor} />
          </div>
        ))}

        {vendorDetail && <RealViewBase data={vendorDetail} />} */}

        <MapProvider>
          {/* {position &&  */}
          <Navermap onIdle={handleMapIdle} />
          {/* } */}
          {/* <MarkerLayer
            points={[
              { lat: 37.5665, lng: 126.978 },
              { lat: 37.5665, lng: 126.97 },
            ]}
          />
          <MarkerLayer
            points={[
              { lat: 37.5665, lng: 125.978 },
              { lat: 37.5665, lng: 124.972 },
            ]}
          /> */}
          <MarkerOverlay vendors={vendorList} onItemClick={handleMarkerClick} />
          <MarkerOverlay vendors={vendorList} onItemClick={handleMarkerClick} />
          <ClusterLayer vendors={clusterData} />
        </MapProvider>
      </div>
    </div>
  )
}
