'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import Navermap from './Map'
import { useMap } from './MapProvider'
import MarkerOverlay from './CustomLayer'
import ClusterLayer from './ClusterLayer'
import { VendorsListDto } from '@/api/dto/vendors.dto'
import { getVendorsList } from '@/api/vendors'
import { VisitedMarker } from '@/components/Map/VisitedMarker'

export default function DataLayer() {
  const [vendorList, setVendorList] = useState<VendorsListDto[]>([])
  const { mapRef, isMapLoaded } = useMap()

  const hospitalVendors = vendorList.filter(
    (vendor) => vendor.category === 'hospital',
  )
  const shopVendors = vendorList.filter((vendor) => vendor.category === 'shop')
  // 클러스터 배열
  const clusterData = [...hospitalVendors, ...shopVendors]

  const [layerVisible] = useState({
    hospital: true,
    shop: true,
    cluster: true,
  })

  //  마커 클릭 이벤트
  const handleMarkerClick = (data: VendorsListDto) => {
    // todo 상세 띄우기
    console.log(data)
  }

  // 리페칭할 이벤트 (필터, 검색)
  const handleMapIdle = () => {
    if (!mapRef.current) return

    const map = mapRef.current

    const center = map.getCenter()
    const zoom = map.getZoom()

    console.log('페칭할 조건을 여기서 가지고 있음', center, zoom)
    return getVendorsList()
    //   {
    //   lat: center.lat(),
    //   lng: center.lng(),
    //   zoom,
    //   filter,
    // }
  }

  useEffect(() => {
    if (!isMapLoaded) return

    const fetch = async () => {
      const data = await handleMapIdle()
      if (data) setVendorList(data)
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded])

  useEffect(() => {
    console.log('페칭된값', vendorList)
  }, [vendorList])

  return (
    <>
      <Navermap />

      {layerVisible.hospital && (
        <MarkerOverlay
          vendors={hospitalVendors}
          onItemClick={handleMarkerClick}
          layerIndex={110}
          MarkerComponent={VisitedMarker}
        />
      )}

      {layerVisible.shop && (
        <MarkerOverlay
          vendors={shopVendors}
          onItemClick={handleMarkerClick}
          layerIndex={120}
        />
      )}

      <ClusterLayer vendors={clusterData} />
    </>
  )
}
