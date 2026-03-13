'use client'

import { NaverMap } from '@/types/map'
import { createContext, useContext, useRef, useState } from 'react'

interface MapContextType {
  mapRef: React.RefObject<NaverMap | null>
  zoom: number
  setZoom: (v: number) => void
  isMarkerLoaded: boolean
  setIsMarkerLoaded: (v: boolean) => void
  isClusterLoaded: boolean
  setIsClusterLoaded: (v: boolean) => void
}

const MapContext = createContext<MapContextType | null>(null)

export function MapProvider({ children }: { children: React.ReactNode }) {
  const mapRef = useRef<NaverMap | null>(null)
  const [zoom, setZoom] = useState<number>(15)
  const [isMarkerLoaded, setIsMarkerLoaded] = useState(false)
  const [isClusterLoaded, setIsClusterLoaded] = useState(false)

  return (
    <MapContext.Provider
      value={{
        mapRef,
        zoom,
        setZoom,
        isMarkerLoaded,
        setIsMarkerLoaded,
        isClusterLoaded,
        setIsClusterLoaded,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useMap = () => {
  const context = useContext(MapContext)
  if (!context) throw new Error('MapProvider가 필요합니다.')
  return context
}
