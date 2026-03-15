'use client'

import { VendorMarkerBase } from '@/components/Map/VendorMarkerBase'
import { useEffect, useRef } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { useMap } from './MapProvider'
import { VendorsListDto } from '@/api/dto/vendors.dto'
import { ComponentType } from 'react'

export default function MarkerOverlay({
  vendors,
  onItemClick,
  layerIndex = 100,
  MarkerComponent = VendorMarkerBase,
}: {
  vendors: VendorsListDto[]
  onItemClick: (data: VendorsListDto) => void
  layerIndex?: number
  MarkerComponent?: ComponentType<{
    data: VendorsListDto
    onItemClick?: (data: VendorsListDto) => void
  }>
}) {
  const { mapRef, isMapLoaded, zoom } = useMap()

  const overlayRef = useRef<InstanceType<
    ReturnType<typeof createOverlayClass>
  > | null>(null)

  // 1. Overlay 생성
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || overlayRef.current) return

    const map = mapRef.current
    const CustomOverlay = createOverlayClass()
    const overlay = new CustomOverlay(
      vendors,
      layerIndex,
      MarkerComponent,
      onItemClick,
    )

    overlay.setMap(map)
    overlayRef.current = overlay

    return () => overlay.setMap(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded, mapRef])

  // 2. 줌에 따른 숨김여부 처리
  useEffect(() => {
    if (!overlayRef.current) return

    const div = overlayRef.current.getElement?.()

    if (!div) return

    if (zoom < 13) {
      div.style.display = 'none'
    } else {
      div.style.display = 'block'
    }
  }, [zoom])

  // 3. vendors가 바뀌면 draw()만 호출
  useEffect(() => {
    console.log('바뀐 마커 호출')
    overlayRef.current?.updateMarkers(vendors)
  }, [vendors])

  return null
}

const createOverlayClass = () => {
  return class CustomOverlay extends window.naver.maps.OverlayView {
    private root?: Root
    private vendors: VendorsListDto[]
    private onItemClick?: (data: VendorsListDto) => void
    private div?: HTMLDivElement
    private layerIndex: number
    private MarkerComponent: ComponentType<{
      data: VendorsListDto
      onItemClick?: (data: VendorsListDto) => void
    }>

    constructor(
      vendors: VendorsListDto[],
      layerIndex: number = 100,
      MarkerComponent: ComponentType<{
        data: VendorsListDto
        onItemClick?: (data: VendorsListDto) => void
      }>,
      onItemClick?: (data: VendorsListDto) => void,
    ) {
      super()
      this.vendors = vendors
      this.onItemClick = onItemClick
      this.layerIndex = layerIndex
      this.MarkerComponent = MarkerComponent
    }

    // vendors 갱신 메서드
    public updateMarkers(newVendors: VendorsListDto[]) {
      this.vendors = newVendors
      const Marker = this.MarkerComponent
      this.root?.render(
        <>
          {this.vendors.map((vendor) => (
            <Marker
              key={vendor.id}
              data={vendor}
              onItemClick={this.onItemClick}
            />
          ))}
        </>,
      )

      requestAnimationFrame(() => this.draw())
    }

    // div 요소 메서드
    public getElement(): HTMLDivElement | undefined {
      return this.div
    }

    onAdd() {
      const div = document.createElement('div')
      this.div = div
      const root = createRoot(div)
      this.root = root
      const Marker = this.MarkerComponent
      root.render(
        <>
          {this.vendors.map((vendor) => (
            <Marker
              key={vendor.id}
              data={vendor}
              onItemClick={this.onItemClick}
            />
          ))}
        </>,
      )

      this.getPanes().overlayLayer.appendChild(div)

      // React 렌더 후 draw() 강제 호출
      requestAnimationFrame(() => {
        this.draw()
      })
    }

    draw() {
      if (!this.div) return

      const projection = this.getProjection()

      if (!projection) return
      //   if (!projection) {
      //     requestAnimationFrame(() => this.draw())
      //     return
      //   }

      this.vendors.forEach((vendor) => {
        const el = this.div?.querySelector(`#marker-${vendor.id}`)
        // if (!el) return
        if (!el) {
          // console.log('다시 그리기')
          requestAnimationFrame(() => this.draw())
          return
        }

        const point = projection.fromCoordToOffset(
          new naver.maps.LatLng(vendor.lat, vendor.lng),
        )

        // console.log('el을 찾는가', el)
        // if (el) {
        const marker = el as HTMLElement
        marker.style.position = 'absolute'
        marker.style.zIndex = String(this.layerIndex)
        marker.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`
        // }
      })
    }

    onRemove() {
      this.div?.remove()
    }
  }
}
