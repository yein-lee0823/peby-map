'use client'

import { RealMarker } from '@/components/Map/VendorMarkerBase'
import { useEffect, useRef } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { useMap } from './MapProvider'
import { VendorsListDto } from '@/api/dto/vendors.dto'

export default function MarkerOverlay({
  vendors,
  onItemClick,
}: {
  vendors: VendorsListDto[]
  onItemClick: (data: VendorsListDto) => void
}) {
  const { mapRef, isMarkerLoaded, zoom } = useMap()

  const overlayRef = useRef<InstanceType<
    ReturnType<typeof createOverlayClass>
  > | null>(null)

  // ① Overlay 한 번만 생성
  useEffect(() => {
    if (!isMarkerLoaded || !mapRef.current || overlayRef.current) return

    const map = mapRef.current
    const CustomOverlay = createOverlayClass()
    const overlay = new CustomOverlay(vendors, onItemClick)

    overlay.setMap(map)
    overlayRef.current = overlay

    return () => overlay.setMap(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMarkerLoaded, mapRef])

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

  // ② vendors가 바뀌면 draw()만 호출
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

    constructor(
      vendors: VendorsListDto[],
      onItemClick?: (data: VendorsListDto) => void,
    ) {
      super()
      this.vendors = vendors
      this.onItemClick = onItemClick
    }

    // vendors 갱신 메서드
    public updateMarkers(newVendors: VendorsListDto[]) {
      this.vendors = newVendors
      // console.log('마커를 갱신할 때, 마커 다시 생성')

      this.root?.render(
        <>
          {this.vendors.map((vendor) => (
            <RealMarker
              key={vendor.id}
              data={vendor}
              onItemClick={this.onItemClick}
            />
          ))}
        </>,
      )

      requestAnimationFrame(() => this.draw())
    }

    // 요소 가져와서 zoom 값에 따라 on/off
    public getElement(): HTMLDivElement | undefined {
      return this.div
    }

    onAdd() {
      const div = document.createElement('div')
      this.div = div
      const root = createRoot(div)
      this.root = root

      root.render(
        <>
          {this.vendors.map((vendor) => (
            <RealMarker
              key={vendor.id}
              data={vendor}
              onItemClick={this.onItemClick}
            />
          ))}
        </>,
      )

      this.getPanes().overlayLayer.appendChild(div)

      //
      // React 렌더 후 draw() 강제 호출
      requestAnimationFrame(() => {
        this.draw()
      })
    }

    draw() {
      // console.log('처음에는 여기를 안그리나')
      if (!this.div) return

      const projection = this.getProjection()
      // console.log('혹시 이게 없어서?', projection)
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
        marker.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`
        // }
      })
    }

    onRemove() {
      this.div?.remove()
    }
  }
}
