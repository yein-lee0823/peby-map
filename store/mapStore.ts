import { create } from 'zustand'
import { NaverMap } from '@/types/map'

interface MapStore {
  mapStore: NaverMap | null
  setMapStore: (map: NaverMap) => void

  zoom: number
  setZoom: (v: number) => void

  isMapLoaded: boolean
  setIsMapLoaded: (v: boolean) => void

  isClusterLoaded: boolean
  setIsClusterLoaded: (v: boolean) => void

  layerVisible: {
    layer1: boolean
    layer2: boolean
  }
  setLayerVisible: (v: Partial<MapStore['layerVisible']>) => void
}

export const useMapStore = create<MapStore>((set) => ({
  mapStore: null,
  setMapStore: (mapStore) => set({ mapStore }),

  zoom: 0,
  setZoom: (v) => {
    set({ zoom: v })
  },

  isMapLoaded: false,
  setIsMapLoaded: (v) => set({ isMapLoaded: v }),

  isClusterLoaded: false,
  setIsClusterLoaded: (v) => set({ isClusterLoaded: v }),

  layerVisible: {
    layer1: true,
    layer2: true,
  },
  setLayerVisible: (v) =>
    set((state) => ({
      layerVisible: {
        ...state.layerVisible,
        ...v,
      },
    })),
}))
