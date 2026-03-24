import { axiosClient } from './axios';
import { ResponseDto } from './dto/responseDto';
import { VendorsListDto, VendorsDetailDto } from './dto/vendorsDto';

// 업체 리스트 조회
export const getVendorsList = async (
  lat: number,
  lng: number,
  radius?: number,
): Promise<ResponseDto<VendorsListDto[]>> => {
  const url = '/list';
  const res = await axiosClient.get<ResponseDto<VendorsListDto[]>>(url, {
    params: {
      lat,
      lng,
      radius,
    },
  });
  return res.data;
};

// 업체 상세 조회
export const getVendorsDetail = async (
  id: number,
  lat: number,
  lng: number,
): Promise<ResponseDto<VendorsDetailDto>> => {
  const url = `/${id}`;
  const res = await axiosClient.get<ResponseDto<VendorsDetailDto>>(url, {
    params: {
      lat,
      lng,
    },
  });
  return res.data;
};
