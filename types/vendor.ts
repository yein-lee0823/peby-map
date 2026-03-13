import { VendorsListDto, VendorsViewDto } from '@/api/dto/vendors.dto'

// 마커, 업체 리스트 타입
export interface VendorListBaseProps {
  data: VendorsListDto
  onItemClick?: (data: VendorsListDto) => void
}

// 업체 상세 타입
export interface VendorViewBaseProps {
  data?: VendorsViewDto
}
