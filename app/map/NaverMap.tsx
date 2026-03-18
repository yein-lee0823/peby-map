'use client';

import Script from 'next/script';
import { useMapStore } from '@/store/mapStore';
import { useEffect } from 'react';

interface NavermapProp {
  refetch: (map: naver.maps.Map) => Promise<void>;
}

export default function Navermap({ refetch }: NavermapProp) {
  const setMap = useMapStore((s) => s.setMapStore);
  const setIsMapLoaded = useMapStore((s) => s.setIsMapLoaded);
  const setIsClusterLoaded = useMapStore((s) => s.setIsClusterLoaded);
  const setZoom = useMapStore((s) => s.setZoom);

  const initializeMap = () => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.5665, 126.978),
      zoom: 15,
    });

    // map 전역상태에 등록
    setMap(map);
    setZoom(map.getZoom());

    // 초기 좌표 = 내 위치
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          console.log(lat, lng, '이 좌표로 센터로 이동');
          map.setCenter(new naver.maps.LatLng(lat, lng));

          const data = { lat, lng };
          // 앱으로 전달
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
            console.log('이게 있을까???', window.ReactNativeWebView);
            console.log('userAgent:', navigator.userAgent);
          }
        },
        (err) => {
          console.log('위치 가져오기 실패', err);
        },
      );
    }

    // map에 zoom 이벤트 등록 (클러스터 on/off 를 위함)
    naver.maps.Event.addListener(map, 'zoom_changed', () => {
      console.log('zoom 상태값을 관리함', map.getZoom());
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
        console.log('bounds 벗어남 👉 fetch');
        isRefetch = true;
      }

      // 줌인인데 기존 범위 안이면 fetch ❌
      if (isZoomIn && isInside) {
        console.log('줌인 + 기존 범위 내부 👉 fetch 안함');
        isRefetch = false;
      }

      if (!isRefetch) {
        console.log('no fetchhhhhhhhhhhh');
        return;
      }

      await refetch(map);

      prevBounds = currentBounds;
      prevZoom = currentZoom;
    });
  };

  useEffect(() => {
    const send = () => {
      if (window.ReactNativeWebView) {
        console.log('보낸다!');
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ test: 'hello' }),
        );
      } else {
        console.log('없어서 재시도...');
        setTimeout(send, 300);
      }
    };

    send();
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
          script.src = '/scripts/MarkerClustering.js'; // 프로젝트 안에 추가한 MarkerClustering.js
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
