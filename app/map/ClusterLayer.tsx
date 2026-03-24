'use client';

import { useEffect, useRef } from 'react';
import { VendorsListDto } from '@/api/dto/vendors.dto';
import { useMapStore } from '@/store/mapStore';

interface ClusterLayerProps {
  vendors: VendorsListDto[];
}

export default function ClusterLayer({ vendors }: ClusterLayerProps) {
  const mapStore = useMapStore((s) => s.mapStore);
  const isMapLoaded = useMapStore((s) => s.isMapLoaded);
  const isClusterLoaded = useMapStore((s) => s.isClusterLoaded);
  const zoom = useMapStore((s) => s.zoom);

  const clusterRef = useRef<{
    markers: naver.maps.Marker[];
    clusterer: MarkerClustering | null;
  }>({ markers: [], clusterer: null });

  useEffect(() => {
    if (!isMapLoaded || !mapStore || !isClusterLoaded) return;

    const map = mapStore;
    const markers = clusterRef.current.markers;
    const zoomInit = map.getZoom();

    // vendors 개수가 바뀌면 마커 재생성
    if (markers.length !== vendors.length) {
      markers.forEach((m) => m.setMap(null));

      clusterRef.current.markers = vendors.map(
        (vendor) =>
          new naver.maps.Marker({
            position: new naver.maps.LatLng(vendor.lat, vendor.lng),
            icon: { content: '<div style="display:none;"></div>' },
          }),
      );

      if (clusterRef.current.clusterer) {
        clusterRef.current.clusterer.setMarkers(clusterRef.current.markers);
      }
    } else {
      // 개수 같으면 위치만 업데이트
      markers.forEach((m, i) => {
        const vendor = vendors[i];
        m.setPosition(new naver.maps.LatLng(vendor.lat, vendor.lng));
      });
    }

    // 클러스터 생성
    if (!clusterRef.current.clusterer) {
      clusterRef.current.clusterer = new MarkerClustering({
        map,
        markers: clusterRef.current.markers,
        minClusterSize: 1,
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
        indexGenerator: [10],
        stylingFunction: (clusterMarker, count) => {
          const el = clusterMarker.getElement?.();
          if (el) el.querySelector('div')!.textContent = String(count);
        },
      });
    }

    // zoom 기준으로 마커/클러스터 전환
    if (zoomInit < 13) {
      clusterRef.current.clusterer.setMap(map);
    } else {
      clusterRef.current.clusterer.setMap(null);
    }
  }, [isMapLoaded, isClusterLoaded, mapStore, vendors, zoom]);

  return null;
}
