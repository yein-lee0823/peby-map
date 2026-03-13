import { axiosClient } from './axios'
import { VendorsListDto } from './dto/vendors.dto'
import { mockVendorDetail, mockVendorsList } from './mock/vendors'

// 업체 리스트 조회
export const getVendorsList = async (): Promise<VendorsListDto[]> =>
  // params (위도, 경도, zoom 레벨에 따른 반경)
  {
    return mockVendorsList
    const url = '/vendors/list'
    const res = await axiosClient.get(url, {
      // params
    })
    return res.data
  }

// 업체 상세 조회
export const getVendorsDetail = async (id: number) => {
  return mockVendorDetail
  const url = `/vendors/${id}`
  const res = await axiosClient.get(url)
  return res.data
}
