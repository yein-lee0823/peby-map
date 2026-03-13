'use client'

import { useEffect, useRef } from 'react'
import { useMap } from './MapProvider'
import type { Coordinates } from '../../types/map'

interface MarkerLayerProps {
  points: Coordinates[]
}

export default function MarkerLayer({ points }: MarkerLayerProps) {
  const { mapRef } = useMap()
  const markersRef = useRef<naver.maps.Marker[]>([])

  useEffect(() => {
    if (!mapRef?.current) return

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    // 새로운 마커 생성
    points.forEach((p) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(p.lat, p.lng),
        map: mapRef.current!,
      })
      markersRef.current.push(marker)
    })
  }, [mapRef, points])

  return null
}
