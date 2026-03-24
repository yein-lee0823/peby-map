export interface PlaceLocation {
  placeId: number;
  latitude: number;
  longitude: number;
}

export interface BusinessInfo {
  business: BusinessDto;
  isPartner: boolean;
  distanceMeter: number;
}

// 리스트 조회
export interface VendorsListDto {
  location: PlaceLocation;
  businessList: BusinessInfo[];
}

export interface BusinessDto {
  id: number;
  placeId: number;
  businessType: string;
  name: string;
  address: string;
  extraAddress: string;
  contact: string;
  sns: string;
  businessHours: string;
  parkingAvailable: boolean;
  source: string;
  isActive: boolean;
}

export interface PlaceEventInfo {
  id: number;
  title: string;
  description: string;
  images: string;
  startDate: string;
  endDate: string;
  metadata: string;
}

// 상세 조회
export interface VendorsDetailDto {
  latitude: number;
  longitude: number;
  business: BusinessDto;
  isPartner: boolean;
  distanceMeter: number;
  events: PlaceEventInfo[];
}
