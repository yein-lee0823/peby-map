import axios, { AxiosError, AxiosResponse } from 'axios'

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

axiosClient.interceptors.request.use(
  (config) => {
    // 로그인 정보 필요한 경우 토큰 추가
    return config
  },
  (error: AxiosError) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  },
)

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 성공 응답 처리
    return response
  },
  (error: AxiosError) => {
    // 에러 처리
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 400:
          console.error('Bad Request:', data)
          break
        case 401:
          console.error('Unauthorized:', data)
          break
        case 403:
          console.error('Forbidden:', data)
          break
        case 404:
          console.error('Not Found:', data)
          break
        case 500:
          console.error('Internal Server Error:', data)
          break
        default:
          console.error(`HTTP ${status} Error:`, data)
      }
    } else if (error.request) {
      // 네트워크 에러
      console.error('Network Error:', error.message)
    } else {
      // 기타 에러
      console.error('Unknown Error:', error.message)
    }

    return Promise.reject(error)
  },
)
