declare class MarkerClustering {
  constructor(options: {
    map: naver.maps.Map;
    markers: naver.maps.Marker[];

    minClusterSize?: number;
    maxZoom?: number;
    gridSize?: number;
    disableClickZoom?: boolean;

    icons?: ClusterIcon[];

    indexGenerator?: number[];

    stylingFunction?: (clusterMarker: ClusterMarker, count: number) => void;
  });

  setMap(map: naver.maps.Map | null): void;

  setMarkers(markers: naver.maps.Marker[]): void;
}
declare class ClusterMarker {
  getElement(): HTMLElement;
}

interface ClusterIcon {
  content: string;
  size: naver.maps.Size;
  anchor: naver.maps.Point;
}
