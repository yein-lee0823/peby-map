'use client';

import Script from 'next/script';
import { useMapStore } from '@/store/mapStore';
import { useEffect, useRef } from 'react';
import { NaverMap } from '@/types/map';
import { isProxyFile } from 'next/dist/build/utils';

interface NavermapProp {
  refetch: (map: naver.maps.Map) => Promise<void>;
}

export default function Navermap({ refetch }: NavermapProp) {
  const setMap = useMapStore((s) => s.setMapStore);
  const setIsMapLoaded = useMapStore((s) => s.setIsMapLoaded);
  const setIsClusterLoaded = useMapStore((s) => s.setIsClusterLoaded);
  const setZoom = useMapStore((s) => s.setZoom);

  // Ref
  const mapRef = useRef<NaverMap | null>(null);
  const centerRef = useRef<{ lat: number; lng: number } | null>(null);

  // map 초기화
  const initializeMap = () => {
    const isRN = typeof window !== 'undefined' && window.ReactNativeWebView; // RN 여부
    let center;

    // RN에서 넘어온 좌표값
    if (centerRef.current) {
      const { lat, lng } = centerRef.current;
      center = new naver.maps.LatLng(lat, lng);
    } else {
      // 기본값
      center = new naver.maps.LatLng(37.5665, 126.978);
    }

    const map = new naver.maps.Map('map', {
      center,
      zoom: 15,
    });

    mapRef.current = map;

    // map 전역상태 저장
    setMap(map);
    setZoom(map.getZoom());

    // RN 아닐 때만(브라우저 실행시) geolocation 으로 좌표 이동
    if (!isRN && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          map.setCenter(new naver.maps.LatLng(lat, lng));
        },
        (err) => {
          console.log('위치 가져오기 실패', err);
        },
      );
    }

    // map에 zoom 이벤트 등록 (클러스터 on/off 를 위함)
    naver.maps.Event.addListener(map, 'zoom_changed', () => {
      setZoom(map.getZoom());
    });

    // 비교할 이전 bounds
    let prevBounds: naver.maps.LatLngBounds | null = null;
    let prevZoom: number | null = null;

    // map 이동시 리페치
    naver.maps.Event.addListener(map, 'idle', async () => {
      const currentBounds = map.getBounds() as naver.maps.LatLngBounds;
      const currentZoom = map.getZoom();

      // 최초 1회
      if (!prevBounds) {
        prevBounds = currentBounds;
        prevZoom = currentZoom;

        return;
      }

      let isRefetch = false;

      const isZoomIn = prevZoom !== null && currentZoom > prevZoom;
      const isZoomOut = prevZoom !== null && currentZoom < prevZoom;

      // 줌아웃이면 무조건 fetch
      if (isZoomOut) {
        console.log('줌아웃 👉 fetch');
        isRefetch = true;
      }

      const PADDING = 0.002; // 약 500m

      const paddedBounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(
          prevBounds.getSW().lat() - PADDING,
          prevBounds.getSW().lng() - PADDING,
        ),
        new naver.maps.LatLng(
          prevBounds.getNE().lat() + PADDING,
          prevBounds.getNE().lng() + PADDING,
        ),
      );

      // 이동 체크 (bounds 밖으로 나갔을 때만)
      const isInside =
        paddedBounds.hasLatLng(currentBounds.getSW()) &&
        paddedBounds.hasLatLng(currentBounds.getNE());

      if (!isInside) {
        isRefetch = true;
      }

      // 줌인인데 기존 범위 안이면 fetch X
      if (isZoomIn && isInside) {
        isRefetch = false;
      }

      if (!isRefetch) {
        console.log('no fetchhhhhh');
        return;
      }

      await refetch(map);

      prevBounds = currentBounds;
      prevZoom = currentZoom;
    });
  };

  // RN에서 위치 값 받아오기
  useEffect(() => {
    if (!window.ReactNativeWebView) return;

    // RN에서 받은 현위치 값으로 지도 이동
    const onMessage = (event: Event) => {
      if (!(event instanceof MessageEvent)) return;

      const data = JSON.parse(event.data);

      // LOCATION 데이터
      if (data.type === 'LOCATION') {
        const { lat, lng } = data.data;
        centerRef.current = { lat, lng };

        if (mapRef.current) {
          mapRef.current.setCenter(new naver.maps.LatLng(lat, lng));
        }
      }

      // if (data.type === 'USER_DATA')
      // 추후에 유저데이터 전역으로 저장
    };

    // RN에서 현위치 값 받는 이벤트 등록
    document.addEventListener('message', onMessage); // ios
    window.addEventListener('message', onMessage); // android

    // RN으로 준비 완료 알림
    window.ReactNativeWebView.postMessage('ready');

    return () => {
      document.removeEventListener('message', onMessage); // ios
      window.removeEventListener('message', onMessage); // android
    };
  }, []);

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          initializeMap();
          console.log('naver maps loaded');
          setIsMapLoaded(true);

          // 클러스터 js
          const script = document.createElement('script');
          script.src = '/scripts/MarkerClustering.js';
          script.onload = () => {
            console.log('MarkerClustering loaded');
            setIsClusterLoaded(true);
          };
          document.head.appendChild(script);
        }}
      />
      <div id="map" style={{ width: '100vw', height: '100vh' }} />
    </>
  );
}
