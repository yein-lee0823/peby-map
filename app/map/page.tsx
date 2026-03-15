'use client'

import { MapProvider } from './MapProvider'
import DataLayer from './DataLayer'

export default function Map() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex min-h-screen w-full flex-col justify-content-between items-center">
        <MapProvider>
          <DataLayer />
        </MapProvider>
      </div>
    </div>
  )
}
