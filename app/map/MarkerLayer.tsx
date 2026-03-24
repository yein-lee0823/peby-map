'use client';

import { VendorMarkerBase } from '@/components/Map/common/VendorMarkerBase';
import { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { VendorsListDto } from '@/api/dto/vendorsDto';
import { ComponentType } from 'react';
import { useMapStore } from '@/store/mapStore';
import { LayerKey } from '@/types/map';

export default function MarkerLayer({
  vendors,
  onItemClick,
  layerKey,
  MarkerComponent = VendorMarkerBase,
}: {
  vendors: VendorsListDto[];
  onItemClick: (data: VendorsListDto) => void;
  layerKey: LayerKey;
  MarkerComponent?: ComponentType<{
    data: VendorsListDto;
    onItemClick?: (data: VendorsListDto) => void;
  }>;
}) {
  const mapStore = useMapStore((s) => s.mapStore);
  const isMapLoaded = useMapStore((s) => s.isMapLoaded);
  const zoom = useMapStore((s) => s.zoom);
  const layerVisible = useMapStore((s) => s.layerVisible);

  // layer key 값에 따른 z-index
  const layerNumber = Number(layerKey.replace('layer', ''));
  const layerIndex = 100 + layerNumber * 10;

  const overlayRef = useRef<InstanceType<
    ReturnType<typeof createOverlayClass>
  > | null>(null);

  // Overlay 생성
  useEffect(() => {
    if (!isMapLoaded || !mapStore || overlayRef.current) return;

    const map = mapStore;
    const CustomOverlay = createOverlayClass();
    const overlay = new CustomOverlay(
      vendors,
      layerIndex,
      MarkerComponent,
      onItemClick,
    );

    overlay.setMap(map);
    overlayRef.current = overlay;

    return () => {
      overlay.setMap(null);
      overlayRef.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded, mapStore]);

  // 줌 & layer on/off에 따른 숨김여부 처리
  useEffect(() => {
    if (!overlayRef.current) return;

    const div = overlayRef.current.getElement?.();

    if (!div) return;

    // layer on/off 전역상태
    const visible = layerVisible[layerKey];

    if (zoom < 13 || !visible) {
      div.style.display = 'none';
    } else {
      div.style.display = 'block';
    }
  }, [zoom, layerVisible, layerKey]);

  // vendors가 바뀌면 draw()만 호출
  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.updateMarkers(vendors);
  }, [vendors]);

  return null;
}

const createOverlayClass = () => {
  return class CustomOverlay extends window.naver.maps.OverlayView {
    private root?: Root;
    private vendors: VendorsListDto[];
    private onItemClick?: (data: VendorsListDto) => void;
    private div?: HTMLDivElement;
    private layerIndex: number;
    private MarkerComponent: ComponentType<{
      data: VendorsListDto;
      onItemClick?: (data: VendorsListDto) => void;
    }>;

    constructor(
      vendors: VendorsListDto[],
      layerIndex: number,
      MarkerComponent: ComponentType<{
        data: VendorsListDto;
        onItemClick?: (data: VendorsListDto) => void;
      }>,
      onItemClick?: (data: VendorsListDto) => void,
    ) {
      super();
      this.vendors = vendors;
      this.onItemClick = onItemClick;
      this.layerIndex = layerIndex;
      this.MarkerComponent = MarkerComponent;
    }

    // vendors 갱신 메서드
    public updateMarkers(newVendors: VendorsListDto[]) {
      this.vendors = newVendors;
      const Marker = this.MarkerComponent;
      this.root?.render(
        <>
          {this.vendors.map((vendor) => (
            <Marker
              key={vendor.location.placeId}
              data={vendor}
              onItemClick={this.onItemClick}
            />
          ))}
        </>,
      );

      requestAnimationFrame(() => this.draw());
    }

    // div 요소 메서드
    public getElement(): HTMLDivElement | undefined {
      return this.div;
    }

    onAdd() {
      const div = document.createElement('div');
      this.div = div;

      const root = createRoot(div);
      this.root = root;

      const Marker = this.MarkerComponent;

      root.render(
        <>
          {this.vendors.map((vendor) => (
            <Marker
              key={vendor.location.placeId}
              data={vendor}
              onItemClick={this.onItemClick}
            />
          ))}
        </>,
      );

      this.getPanes().overlayLayer.appendChild(div);

      // React 렌더 후 draw() 강제 호출
      requestAnimationFrame(() => {
        this.draw();
      });
    }

    draw() {
      if (!this.div) return;

      const projection = this.getProjection();

      if (!projection) return;

      this.vendors.forEach((vendor) => {
        const el = this.div?.querySelector(
          `#marker-${vendor.location.placeId}`,
        );

        if (!el) {
          requestAnimationFrame(() => this.draw());
          return;
        }

        const point = projection.fromCoordToOffset(
          new naver.maps.LatLng(
            vendor.location.latitude,
            vendor.location.longitude,
          ),
        );

        const marker = el as HTMLElement;
        marker.style.position = 'absolute';
        marker.style.zIndex = String(this.layerIndex);
        marker.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
      });
    }

    onRemove() {
      this.div?.remove();
    }
  };
};
