'use client'

import Script from 'next/script'
import { useMap } from './MapProvider'
// import { Coordinates } from '@/types/map'
// import { getVendorsList } from '@/api/vendors'

export default function Navermap() {
  const { mapRef, setIsMapLoaded, setIsClusterLoaded, setZoom } = useMap()

  if (!mapRef) return

  const initializeMap = () => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.5665, 126.978),
      zoom: 15,
    })

    console.log(map, '처음에는 이 좌표로 센터를 잡았다가')

    // mapRef에 등록
    mapRef.current = map

    console.log('현 위치', navigator)
    console.log('현 위치', navigator.geolocation)
    // 초기 좌표 = 내 위치
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          console.log(lat, lng, '이 좌표로 센터로 이동')
          map.setCenter(new naver.maps.LatLng(lat, lng))
        },
        (err) => {
          console.log('위치 가져오기 실패', err)
        },
      )
    }

    // map에 zoom 이벤트 등록 (클러스터 on/off 를 위함)
    naver.maps.Event.addListener(map, 'zoom_changed', () => {
      console.log('zoom 상태값을 관리함', map.getZoom())
      setZoom(map.getZoom())
    })

    // map 이동시, 센터값 구하기
    // naver.maps.Event.addListener(map, 'idle', () => {
    //   // 여기에서는 실행만 (필요한 값들은 page가 알고있음)
    //   // todo 디바운스 적용이 필요하겠는데..?
    //   onIdle?.(map)
    //   console.log('여기에서 chaaaaaange 될 때 페치')
    // })
  }

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('naver maps loaded')
          initializeMap()

          // 클러스터 js
          // 클러스터링 스크립트 추가 로드
          const script = document.createElement('script')
          script.src = '/scripts/MarkerClustering.js' // 프로젝트 안에 추가한 MarkerClustering.js
          script.onload = () => {
            console.log('MarkerClustering loaded')
            // ClusterLayer() // 마커+클러스터 초기화 함수
            setIsClusterLoaded(true)
          }
          document.head.appendChild(script)

          setIsMapLoaded(true)
        }}
      />
      <div id="map" style={{ width: '100vw', height: '100vh' }} />
    </>
  )
}
