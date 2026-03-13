export interface VendorsListDto {
  id: number
  name: string // 업체명
  markerImage: string // 마커이미지
  markerImgWidth: number // 마커이미지 가로사이즈
  markerImgHeight: number // 마커이미지 세로사이즈
  imgWidth: number // 마커이미지 가로사이즈
  imgHeight: number // 마커이미지 세로사이즈
  thumbnail: string // 썸네일
  category: string // 업체분류
  lat: number // 위도
  lng: number // 경도
}

export interface VendorsViewDto {
  id: number
  name: string // 업체명
  thumbnail: string // 썸네일
  imgWidth: number // 마커이미지 가로사이즈
  imgHeight: number // 마커이미지 세로사이즈
  category: string // 업체분류
  operatingHours: string // 운영시간
  businessStatus: string // 영업상태정보
  usageGuide: string // 이용안내
  phoneNumber: string // 전화번호
  address: string // 주소
}

export interface VendorsViewDto extends VendorsListDto {
  calendar: string
}
