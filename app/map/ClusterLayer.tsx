'use client'

import { useEffect, useRef } from 'react'
import { useMap } from './MapProvider'
import { VendorsListDto } from '@/api/dto/vendors.dto'

interface ClusterLayerProps {
  vendors: VendorsListDto[]
}

export default function ClusterLayer({ vendors }: ClusterLayerProps) {
  const { mapRef, isMarkerLoaded, isClusterLoaded, zoom } = useMap()

  // 마커와 클러스터를 저장하는 ref
  const clusterRef = useRef<{
    markers: naver.maps.Marker[]
    clusterer: MarkerClustering | null
  }>({ markers: [], clusterer: null })

  useEffect(() => {
    if (!isMarkerLoaded || !mapRef.current || !isClusterLoaded) return

    const map = mapRef.current
    const markers = clusterRef.current.markers

    // ① 더미 마커 생성 (보이지 않게)
    // if (clusterRef.current.markers.length === 0) {
    //   clusterRef.current.markers = vendors.map(
    //     (vendor) =>
    //       new naver.maps.Marker({
    //         position: new naver.maps.LatLng(vendor.lat, vendor.lng),
    //         icon: { content: '<div style="display:none;"></div>' }, // 실제로 안보임
    //       }),
    //   )
    // } else {
    //   // 위치만 업데이트
    //   clusterRef.current.markers.forEach((m, i) => {
    //     if (vendors[i])
    //       m.setPosition(new naver.maps.LatLng(vendors[i].lat, vendors[i].lng))
    //   })
    // }

    // ① vendors 개수가 바뀌면 마커 재생성
    if (markers.length !== vendors.length) {
      markers.forEach((m) => m.setMap(null))

      clusterRef.current.markers = vendors.map(
        (vendor) =>
          new naver.maps.Marker({
            position: new naver.maps.LatLng(vendor.lat, vendor.lng),
            icon: { content: '<div style="display:none;"></div>' },
          }),
      )

      if (clusterRef.current.clusterer) {
        clusterRef.current.clusterer.setMarkers(clusterRef.current.markers)
      }
    } else {
      // ② 개수 같으면 위치만 업데이트
      markers.forEach((m, i) => {
        const vendor = vendors[i]
        m.setPosition(new naver.maps.LatLng(vendor.lat, vendor.lng))
      })
    }

    // ② 클러스터 생성
    if (!clusterRef.current.clusterer) {
      clusterRef.current.clusterer = new MarkerClustering({
        map,
        markers: clusterRef.current.markers,
        minClusterSize: 2,
        maxZoom: 20,
        disableClickZoom: false,
        gridSize: 120,
        icons: [
          {
            content:
              '<div style="width:40px;height:40px;background:#FF6000;border-radius:50%;text-align:center;color:white;font-weight:bold;line-height:40px;"></div>',
            size: new naver.maps.Size(40, 40),
            anchor: new naver.maps.Point(20, 20),
          },
        ],
        indexGenerator: [10, 100],
        stylingFunction: (clusterMarker, count) => {
          const el = clusterMarker.getElement?.()
          if (el) el.querySelector('div')!.textContent = String(count)
        },
      })
    }

    // ④ zoom 기준으로 마커/클러스터 전환
    if (zoom < 13) {
      clusterRef.current.clusterer.setMap(map)
    } else {
      clusterRef.current.clusterer.setMap(null)
    }

    // cleanup: 마커나 클러스터를 새로 만들 필요 없음
  }, [isMarkerLoaded, isClusterLoaded, mapRef, vendors, zoom])

  return null
}
